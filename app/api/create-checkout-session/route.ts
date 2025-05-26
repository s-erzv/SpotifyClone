import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createOrRetrieveACustomer } from "@/libs/supabaseAdmin";

interface CheckoutBody {
  price: string; // langsung string ID dari frontend
  quantity?: number;
  metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} }: CheckoutBody = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }} = await supabase.auth.getUser();

    const customer = await createOrRetrieveACustomer({
      uuid: user?.id || "",
      email: user?.email || "",
    });

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      customer: customer,
      line_items: [
        {
          price,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${getUrl()}/account`,
      cancel_url: `${getUrl()}`,
    });



    return NextResponse.json({ sessionId: session.id });

  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 });
  }
}
