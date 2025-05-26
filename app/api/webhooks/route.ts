import { NextRequest } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/libs/stripe";
import {
  upsertPriceRecord,
  upsertProductRecord,
  manageSubscriptionStatusChange,
} from "@/libs/supabaseAdmin";

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown webhook error";

    console.error("❌ Webhook Error:", errorMessage);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }


  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            await manageSubscriptionStatusChange(
              checkoutSession.subscription as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          console.warn(`🔸 Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("❌ Webhook handler failed:", err);
      return new Response("Webhook handler failed.", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
