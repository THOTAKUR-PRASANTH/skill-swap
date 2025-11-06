import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Define a schema for the search query
const searchSchema = z.object({
  term: z.string().min(1, "Search term must not be empty."),
});

/**
 * API route to search for users in CockroachDB/Prisma.
 * This is a GET request that takes a 'term' query parameter.
 * Example: /api/users/search?term=john
 */
export async function GET(request: Request) {
  try {
    // 1. Get the current user's session
    const session = await getServerSession(authOptions);

    // 2. Check if the user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // 3. Get and validate the search term from the URL
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("term");

    const validation = searchSchema.safeParse({ term: searchTerm });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const term = validation.data.term;

    // 4. Query the CockroachDB/Prisma database
    // We search for users where their 'name' OR 'email' contains the search term.
    // We also explicitly exclude the current user from the results.
    const users = await prisma.user.findMany({
      where: {
        // Exclude the current user from search results
        id: {
          not: currentUserId,
        },
        // Case-insensitive search
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive", // This makes it case-insensitive
            },
          },
          {
            email: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      // 5. Only select the fields that are safe to send to the client
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 10, // Limit results to the top 10
    });

    // 6. Return the found users
    return NextResponse.json(users);
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

