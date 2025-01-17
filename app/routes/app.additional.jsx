import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Divider,
  useBreakpoints,
  Button

} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {useState} from "react";
import {json} from "@remix-run/node";
import { useLoaderData,Form } from "@remix-run/react";
import ReactCountriesInput from 'react-countries-input'

import db from "../db.server";

export async function loader() {
  let registry=await db.register.findFirst();
  return json(registry);
}

export async function action({request}) {
  // updates persistentpor cie data
  let reg = await request.formData();
  reg=Object.fromEntries(settings);

  await db.register.create({
    data:{
      name:reg.name,
      lastName: reg.lastName,
      email: reg.email,
      address: reg.address,
      city: reg.city,
      country: reg.country,
      phone: reg.phone,
    }
  });

  return json(reg);
  
}

export default function RegisterPage() {
  const { smUp } = useBreakpoints(); 
  const register=useLoaderData();

  const [formState, setFormState]=useState(register);

  const countyChangeHandler = useCallback(
    (event) => {
      setFormState({
        ...formState,
        country: event.target.value
      });
    },
    [formState]
);
 
  return (
    <Page>
      <TitleBar title="Register page" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Register now!
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
            <BlockStack gap="400">
              <TextField label="Name" value={formState?.name} name="name" onChange={(value)=>setFormState({...formState,name:value})} />
              <TextField label="Last Name" name="lastName" value={formState?.lastName} onChange={(value)=>setFormState({...formState, lastName:value})}/>
              <TextField label="Email" name="email" placeholder="example@example.com" value={formState?.email} onChange={(value)=>setFormState({...formState, email:value})}/>
              <TextField label="Address" name="address" value={formState?.address} onChange={(value)=>setFormState({...formState, address:value})}/>
              <TextField label="City" name="city" value={formState?.city} onChange={(value)=>setFormState({...formState, cityn:value})}/>
              <TextField label="Country" name="country" value={formState?.country} onChange={(value)=>setFormState({...formState, country:value})}/>
              <TextField label="Phone Number" name="phone" value={formState?.phone} onChange={(value)=>setFormState({...formState, phone:value})}/>
              <Button submit={true}>Save</Button>
            </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
