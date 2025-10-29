// Désactivé - utilisation de Keycloak au lieu de Clerk
// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { createUser, updateUser, deleteUser } from "@/lib/users_actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Webhook désactivé - Keycloak gère les utilisateurs différemment
  return NextResponse.json({ message: "Webhook endpoint disabled - using Keycloak" }, { status: 404 });
}

/*
// Ancien code Clerk (désactivé)
export async function POST_OLD(req: Request) {
  console.log("Received a POST request");

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not set in the environment variables");
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Extract headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("Error parsing JSON body:", err);
    return new Response("Invalid JSON", { status: 400 });
  }

  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Verification failed", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username } = evt.data;

    try {
      // Validation avant d'appeler `createUser`
      if (!email_addresses || email_addresses.length === 0) {
        throw new Error("No email addresses provided.");
      }

      await createUser({
        id,
        username: username ?? "Unknown User",
        email_addresses: email_addresses.map((email) => ({
          email: email.email_address, // Transformation pour correspondre au type attendu
        })),
      });

      return NextResponse.json({ message: "User created successfully" });
    } catch (err) {
      console.error("Error creating user:", err);
      return new Response("Error creating user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, username } = evt.data;

    try {
      // Validation avant d'appeler `updateUser`
      if (!email_addresses || email_addresses.length === 0) {
        throw new Error("No email addresses provided.");
      }

      await updateUser({
        id,
        username: username ?? "Unknown User",
        email_addresses: email_addresses.map((email) => ({
          email: email.email_address, // Transformation pour correspondre au type attendu
        })),
      });

      return NextResponse.json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error updating user:", err);
      return new Response("Error updating user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      console.error("Error deleting user: Missing user ID");
      return new Response("Error deleting user: Missing user ID", { status: 400 });
    }

    try {
      await deleteUser(id);
      return NextResponse.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      return new Response("Error deleting user", { status: 500 });
    }
  }

  console.log("Unhandled event type");
  return new Response("Event type not handled", { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: "Webhook endpoint disabled" }, { status: 405 });
}

*/