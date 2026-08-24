interface PaymentInitParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  returnPath?: string;
}

interface PaymentResult {
  paymentUrl: string | null;
  transactionId?: string;
}

export async function initPayment(params: PaymentInitParams): Promise<PaymentResult> {
  const { orderNumber, amount, email, phone, firstName, lastName, returnPath } = params;

  const apiKey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const confirmationPath = returnPath || `/reservation/confirmation?order=${orderNumber}`;

  if (!apiKey || !siteId) {
    return { paymentUrl: null };
  }

  try {
    const response = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: apiKey,
        site_id: siteId,
        transaction_id: orderNumber,
        amount,
        currency: "XOF",
        description: `Conseil en Image - ${orderNumber}`,
        notify_url: process.env.CINETPAY_NOTIFY_URL,
        return_url: `${appUrl}${confirmationPath}`,
        channels: "ALL",
        customer_name: firstName,
        customer_surname: lastName,
        customer_email: email,
        customer_phone_number: phone,
        customer_address: "Abidjan",
        customer_city: "Abidjan",
        customer_country: "CI",
        customer_state: "CI",
        customer_zip_code: "00225",
      }),
    });

    const data = await response.json();

    if (data.code === "201") {
      return {
        paymentUrl: data.data.payment_url,
        transactionId: data.data.payment_token,
      };
    }

    console.error("CinetPay error:", data);
    return { paymentUrl: null };
  } catch (error) {
    console.error("Payment init error:", error);
    return { paymentUrl: null };
  }
}

export async function verifyPayment(transactionId: string): Promise<boolean> {
  const apiKey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;

  if (!apiKey || !siteId) return false;

  try {
    const response = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: apiKey,
        site_id: siteId,
        transaction_id: transactionId,
      }),
    });

    const data = await response.json();
    return data.data?.status === "ACCEPTED";
  } catch {
    return false;
  }
}
