import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createOrRetrieveACustomer } from "@/libs/supabaseAdmin";

export async function POST() {
  //const { price, quantity = 1, metadata = {} } = await request.json(); 

  try {
    const supabase = createRouteHandlerClient({
      cookies
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Could not get user');
    
    const customer = await createOrRetrieveACustomer({
        uuid: user.id,
        email: user.email || '',
    });
    
    if (!customer) throw new Error('Could not get customer');

    const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getUrl()}/account`
    })

    return NextResponse.json({ url });

  } catch (error: unknown) {
  console.error(error);

  const errorMessage = 
    error instanceof Error ? error.message : "Unknown error";

  return new NextResponse(
    `Internal Server Error: ${errorMessage}`, 
    { status: 500 }
  );
}
}