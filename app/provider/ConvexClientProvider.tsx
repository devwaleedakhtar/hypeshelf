"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient, useMutation, useConvexAuth } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <AuthenticatedUserSync />
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}

function AuthenticatedUserSync() {
    const { isAuthenticated } = useConvexAuth();
    const storeUser = useMutation(api.users.store);

    useEffect(() => {
        if (isAuthenticated) {
            storeUser();
        }
    }, [isAuthenticated, storeUser]);

    return null;
}
