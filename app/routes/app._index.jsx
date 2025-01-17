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
  Icon,
  DatePicker,
  FormLayout,
  
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {useState, useCallback, useRef} from "react";
import { useLoaderData,Form,useActionData,useNavigate } from "@remix-run/react";
import {
  CalendarIcon, ComposeIcon
} from '@shopify/polaris-icons'

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  navigate("/app/settings");
};

export default function Index() {
  const indexLoopify  = useLoaderData();
  const [formState, setFormState]=useState(indexLoopify);
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
    <><Text as="h5" variant="base" style="margin-bottom: 25px;">
      Day of the week you will receive the product.
    </Text><Popover
      autofocusTarget="none"
      preferredAlignment="left"
      preferInputActivator={false}
      preferredPosition="below"
      width="100px"
      activator={<Button
        onClick={() => setPopoverActive(!popoverActive)}
        icon={CalendarIcon}
      >
        {selected.title}
      </Button>}
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
          } } />
      </Popover></>
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
const [showCardScheduler, setShowCardScheduler] = useState(false);
const [showCardUnlimited, setShowCardUnlimited] = useState(false);
const [valueTF, setValueTF] = useState('');

const handleChange = useCallback(
  (_checked, newValue) => {
    setValue(newValue);
    console.log(newValue);

    if (newValue === 'optional') {
      setShowCardScheduler(true);
      setShowCardUnlimited(false);
    }else{
      setShowCardScheduler(false);
      setShowCardUnlimited(true);
    }
  },
  []
);

const handleChangeTF = (event) => {
  setValueTF(event.target.value); // Actualiza el estado con el valor ingresado
};

const DatePickerExample = ({ label }) => {
  function nodeContainsDescendant(rootNode, descendant) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const formattedValue = selectedDate.toISOString().slice(0, 10);
  const datePickerRef = useRef(null);
  function isNodeWithinPopover(node) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }
  function handleInputValueChange() {
    console.log("handleInputValueChange");
  }
  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    setSelectedDate(newSelectedDate);
    setVisible(false);
  }
  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  const navigate = useNavigate();
  
  return (
    <BlockStack inlineAlign="center" gap="400">
      <Box minWidth="276px" padding={{ xs: 200 }}>
        <Popover
          active={visible}
          autofocusTarget="none"
          preferredAlignment="left"
          fullWidth
          preferInputActivator={false}
          preferredPosition="below"
          preventCloseOnChildOverlayClick
          onClose={handleOnClose}
          activator={
            <TextField
              role="combobox"
              label={label}
              prefix={<Icon source={CalendarIcon} />}
              value={formattedValue}
              onFocus={() => setVisible(true)}
              onChange={handleInputValueChange}
              autoComplete="off"
            />
          }
        >
          <Card ref={datePickerRef}>
            <DatePicker
              month={month}
              year={year}
              selected={selectedDate}
              onMonthChange={handleMonthChange}
              onChange={handleDateSelection}
            />
          </Card>
        </Popover>
        <Button fullWidth submit={true} >Getting started!</Button>
      </Box>
    </BlockStack>
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
            </ Card >
          </ Layout.Section >
        </Layout>
      </BlockStack>
    </Page>
  );
}
