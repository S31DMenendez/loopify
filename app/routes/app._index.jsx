import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  InlineGrid,
  TextField,
  Label,
  Popover,
  OptionList,
  Divider,
  RadioButton,
  LegacyStack
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {useState, useCallback} from "react";
import { useNavigate } from '@remix-run/react';
import {
  CalendarIcon, ComposeIcon
} from '@shopify/polaris-icons'

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};


export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  


  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  // This example is for guidance purposes. Copying it will come with caveats.
function DateListPicker() {
  const ranges = [
    {
      title: "Select",
      alias: "no-date",
      period: null,
    },
    {
      title: "Monday",
      alias: "mon",
      period: {
        since: "mon",
        until: "mon",
      },
    },
    {
      title: "Tuesday",
      alias: "tue",
      period: {
        since: "tue",
        until: "tue",
      },
    },
    {
      title: "Wednesday",
      alias: "wed",
      period: {
        since: "wed",
        until: "wed",
      },
    },
    {
      title: "Thursday",
      alias: "thu",
      period: {
        since: "thu",
        until: "thu",
      },
    },
    {
      title: "Friday",
      alias: "fri",
      period: {
        since: "fri",
        until: "fri",
      },
    },
    {
      title: "Saturday",
      alias: "sat",
      period: {
        since: "sat",
        until: "sat",
      },
    },
    {
      title: "Sunday",
      alias: "sun",
      period: {
        since: "sun",
        until: "sun",
      },
    },
  ];
  const [selected, setSelected] = useState(ranges[0]);
  const [popoverActive, setPopoverActive] = useState(false);
  return (
    <Popover
      autofocusTarget="none"
      preferredAlignment="left"
      preferInputActivator={false}
      preferredPosition="below"
      activator={
        <Button
          onClick={() => setPopoverActive(!popoverActive)}
          icon={CalendarIcon}
        >
          {selected.title}
        </Button>
      }
      active={popoverActive}
    >
      <OptionList
        options={ranges.map((range) => ({
          value: range.alias,
          label: range.title,
        }))}
        selected={selected.alias}
        onChange={(value) => {
          setSelected(ranges.find((range) => range.alias === value[0]));
          setPopoverActive(false);
        }}
      />
    </Popover>
  )
}

const Placeholder = ({
  label = '',
  height = 'auto',
  width = 'auto',
  minHeight = 'auto',
  padding = '6px 0px',
  strong = false,
}) => {
  return (
    <div
      style={{
        padding: padding,
        height: height,
        width: width,
        minHeight: minHeight,
      }}
    >
      <InlineStack align="center">
        <div>
          <Text
            as="h2"
            variant="headingMd"
            tone="base"
            style={{ fontWeight: strong ? "bold" : "normal" }}
          >
            {label}
          </Text>
        </div>
      </InlineStack>
    </div>
  );
};

const [value, setValue] = useState('disabled');



const handleChange = useCallback(
  
  (_checked, newValue) => {
    setValue(newValue),
    console.log(newValue);

      // Inicializa la navegación
    

    // Redirecciona a la página deseada
  }
);


  return (
    
    <Page
    divider
    primaryAction={{ content: "View on your store", disabled: true }}
    secondaryActions={[
      {
        content: "Duplicate",
        accessibilityLabel: "Secondary action label",
        onAction: () => alert("Duplicate action"),
      },
    ]}>
      <TitleBar title="Loopify">
        {/*<button variant="primary" onClick={generateProduct}>
          Configure
        </button>*/}
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card roundedAbove="sm">
              <Text as="h2" variant="headingSm">
                Configuration
              </Text>
              <Box paddingBlockStart="200">
                <Text as="p" variant="bodyMd">
                  Configure your product variants.
                </Text>
              </Box>
              <br></br>
              <Divider />
              <InlineStack blockAlign="baseline">
                <Placeholder width="100px" label="Period" strong={true} />
                <RadioButton
                  label="Set indefinitely"
                  helpText="There's no expiration date for receiving products."
                  id="disabled"
                  name="accounts"
                  onChange={handleChange}
                  checked={value === 'disabled'}
                />
                <RadioButton
                  label="Set schedule"
                  helpText="Customers will be able to define the period when receiving the products."
                  id="optional"
                  name="accounts"
                  onChange={handleChange}
                  checked={value === 'optional'}
                />
              </InlineStack>
            
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
