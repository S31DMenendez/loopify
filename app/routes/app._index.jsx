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
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {useState} from "react";
import {
  CalendarIcon
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
      <TitleBar title="Loopify Configuration">
        {/*<button variant="primary" onClick={generateProduct}>
          Configure
        </button>*/}
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    When do you want to receive your products?
                  </Text>
                  <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                  <Box
                    as="section"
                    paddingInlineStart={{ xs: 400, sm: 0 }}
                    paddingInlineEnd={{ xs: 400, sm: 0 }}
                  >
                    <BlockStack gap="400">
                      <Text as="h3" variant="headingMd">
                        Details
                      </Text>
                    </BlockStack>
                  </Box>
                  <Card roundedAbove="sm">
                    <BlockStack gap="400">
                      <Text as="p" fontWeight="medium">
                        Select how many times you want to receive your products
                      </Text>
                      <DateListPicker /> 
                      <Text as="p" fontWeight="medium">
                        Select the days you want to receive your products
                      </Text>
                      <DateListPicker /> 
                    </BlockStack>
                  </Card>
                </InlineGrid>
                </BlockStack>
                
                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </Button>
                  {fetcher.data?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                      variant="plain"
                    >
                      View product
                    </Button>
                  )}
                </InlineStack>
                {fetcher.data?.product && (
                  <>
                    <Text as="h3" variant="headingMd">
                      {" "}
                      productCreate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.product, null, 2)}
                        </code>
                      </pre>
                    </Box>
                    <Text as="h3" variant="headingMd">
                      {" "}
                      productVariantsBulkUpdate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.variant, null, 2)}
                        </code>
                      </pre>
                    </Box>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
