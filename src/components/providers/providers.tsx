"use client";

import React from 'react'
import {AuthProvider} from '@/components';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


interface Props {
    children: React.ReactNode;
    session: any;
}

const Providers = ({ children ,session}: Props) => {

    const client = new QueryClient();

    return (
  
        <QueryClientProvider client={client}>
           <AuthProvider session={session}>
                {children}
            </ AuthProvider>  
        </QueryClientProvider>
      
    )
};

export default Providers
