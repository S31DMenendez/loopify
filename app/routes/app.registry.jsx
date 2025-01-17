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
  Button,
  Modal,
  Frame

} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React, {useState,useCallback, useRef, useEffect} from "react";
import {json} from "@remix-run/node";
import { useLoaderData,Form,useActionData,useNavigate } from "@remix-run/react";
import db from "../db.server";

export async function loader() {
  let registry=await db.register.findFirst();
  return json(registry);
}

export async function action({request}) {
  // updates persistentpor cie data
  let reg = await request.formData();
  reg=Object.fromEntries(reg);

  if(reg){
    if(!reg.name || !reg.lastName || !reg.email || !reg.address || !reg.city || !reg.country || !reg.phone){
      return json({error: "All fields are required"},{status:400});
    }else{
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
    
      return json({success: true});
    }
  }
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

  //errores

  const actionData = useActionData(); // Captura errores de la función `action`
  const navigate = useNavigate();
  const [successModalActive, setSuccessModalActive] = useState(false);
  const [errorModalActive, setErrorModalActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (actionData?.success) {
      setSuccessModalActive(true); // Mostrar modal de éxito
    } else if (actionData?.error) {
      setErrorMessage(actionData.error); // Mostrar mensaje de error
      setErrorModalActive(true); // Activar modal de error
    }
  }, [actionData]);

  const toggleSuccessModal = () => {
    setSuccessModalActive(false);
    navigate("/app/settings"); // Cambia esta ruta por la que desees
  };

  const toggleErrorModal = () => {
    setErrorModalActive(false);
  };
 
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
              <Text as="h4" variant="headingMd">
                In order to get you products, we need some information from you.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
            <BlockStack gap="400">
              <TextField label={<span>Name <span style={{color:"red"}}>*</span></span>} name="name"  value={formState?.name} onChange={(value)=>setFormState({...formState,name:value})} />
              <TextField label={<span>Last Name <span style={{color:"red"}}>*</span></span>} name="lastName" value={formState?.lastName} onChange={(value)=>setFormState({...formState, lastName:value})}/>
              <TextField label={<span>Email <span style={{color:"red"}}>*</span></span>} name="email" placeholder="example@example.com" value={formState?.email} onChange={(value)=>setFormState({...formState, email:value})}/>
              <TextField label={<span>Address <span style={{color:"red"}}>*</span></span>} name="address" value={formState?.address} onChange={(value)=>setFormState({...formState, address:value})}/>
              <TextField label={<span>City <span style={{color:"red"}}>*</span></span>} name="city" value={formState?.city} onChange={(value)=>setFormState({...formState, city:value})}/>
              <TextField label={<span>Country <span style={{color:"red"}}>*</span></span>} name="country" value={formState?.country} onChange={(value)=>setFormState({...formState, country:value})}/>
              <TextField label={<span>Phone <span style={{color:"red"}}>*</span></span>} name="phone" value={formState?.phone} onChange={(value)=>setFormState({...formState, phone:value})}/>
              <Button submit={true}>Save</Button>
            </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
      {/* Modal de Éxito */}
        <Modal
          open={successModalActive}
          onClose={toggleSuccessModal}
          title="Success"
          primaryAction={{
            content: "Close",
            onAction: toggleSuccessModal,
          }}
        >
          <Modal.Section>
            <p>Your registration was successful!</p>
          </Modal.Section>
        </Modal>

        {/* Modal de Error */}
        <Modal
          open={errorModalActive}
          onClose={toggleErrorModal}
          title="Error"
          primaryAction={{
            content: "Close",
            onAction: toggleErrorModal,
          }}
        >
          <Modal.Section>
            <p>{errorMessage}</p>
          </Modal.Section>
        </Modal>
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
