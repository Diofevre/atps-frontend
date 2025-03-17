import { prisma } from "@/lib/prisma";

type UserProps = {
  id: string;
  username: string;
  email_addresses: { email: string }[];
};

/**
 * Crée un nouvel utilisateur dans la base de données.
 * @param {UserProps} user - Les détails de l'utilisateur.
 * @throws Lève une erreur si la création échoue.
 */
export async function createUser({ id, username, email_addresses }: UserProps): Promise<void> {
  if (!email_addresses || email_addresses.length === 0) {
    throw new Error("Aucune adresse email fournie.");
  }

  try {
    await prisma.user.create({
      data: {
        clerkId: id,
        username,
        email: email_addresses[0]?.email,
      },
    });
    console.log(`[INFO] Utilisateur créé avec succès : ${id}`);
  } catch (error) {
    console.error(`[ERREUR] Échec de la création de l'utilisateur : ${id}`, error);
    throw new Error("Une erreur s'est produite lors de la création de l'utilisateur.");
  }
}

/**
 * Met à jour un utilisateur existant dans la base de données.
 * @param {UserProps} user - Les détails de l'utilisateur à mettre à jour.
 * @throws Lève une erreur si la mise à jour échoue.
 */
export async function updateUser({ id, username, email_addresses }: UserProps): Promise<void> {
  if (!email_addresses || email_addresses.length === 0) {
    throw new Error("Aucune adresse email fournie.");
  }

  try {
    await prisma.user.update({
      where: { clerkId: id },
      data: {
        username,
        email: email_addresses[0]?.email,
      },
    });
    console.log(`[INFO] Utilisateur mis à jour avec succès : ${id}`);
  } catch (error) {
    console.error(`[ERREUR] Échec de la mise à jour de l'utilisateur : ${id}`, error);
    throw new Error("Une erreur s'est produite lors de la mise à jour de l'utilisateur.");
  }
}

/**
 * Supprime un utilisateur de la base de données.
 * @param {string} id - L'ID Clerk de l'utilisateur à supprimer.
 * @throws Lève une erreur si la suppression échoue.
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { clerkId: id },
    });
    console.log(`[INFO] Utilisateur supprimé avec succès : ${id}`);
  } catch (error) {
    console.error(`[ERREUR] Échec de la suppression de l'utilisateur : ${id}`, error);
    throw new Error("Une erreur s'est produite lors de la suppression de l'utilisateur.");
  }
}