import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress} from '@mui/material';
import CustomerDetail from "@components/dashboard/customers/CustomerDetail";
import {Customer} from "@interfaces/Customer";
import {userResource} from "@resources/userResource";

const CustomerShow: NextPageWithLayout = () => {
    const router = useRouter();
    const {id} = router.query;
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchCustomer() {
            if (typeof id === 'string' && id.length > 0) {
                setLoading(true);
                const customerFetch: Customer = await userResource.getById(id);
                setCustomer(customerFetch);
                setLoading(false);
            }
        }
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    return (
        <>
            <Head>
                <title>Client {customer?.firstName} {customer?.lastName}</title>
            </Head>
            <DashboardLayout />
            <Box
                component="main"
                sx={{marginLeft: '20%', marginRight: '5%', marginTop: '10px'}}>
                    {loading && <CircularProgress />}
                    {!loading && customer && <CustomerDetail customer={customer} />}
            </Box>
        </>
    );
};

export default CustomerShow;
