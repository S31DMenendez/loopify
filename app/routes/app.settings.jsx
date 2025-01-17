import {
  Box,
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Divider,
  useBreakpoints,
  Button,
  InlineStack,
  Label,
  Popover,
  OptionList,
  RadioButton,
  Icon,
  DatePicker,
  FormLayout,

} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState,useCallback, useRef, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData,Form } from "@remix-run/react";
import {
  CalendarIcon, ComposeIcon
} from '@shopify/polaris-icons'

import db from "../db.server";

export async function loader() {
  let settings=await db.schedule.findFirst();
  return json(settings);
}

export async function action({request}) {
  /*let settings = await request.formData();
  settings=Object.fromEntries(settings);
  console.log("aqui acrion")
  await db.test.upsert({
    where:{
      id:1
    },
    update:{
      test: settings.description
    },
    create:{
      id: 1,
      test: settings.description
    }
  });

  return json(settings);*/
  let settings = await request.formData();
  settings=Object.fromEntries(settings);

  await db.schedule.create({
    
    data:{
      shop: "local",
      scheduleType: 2,
      dayOfWeek: getDayNumber(settings.dayOfWeek),
      dateStart: new Date(settings.dateStart),
      dateEnd: new Date(settings.dateEnd),
    }
  });

  return json(settings);
  
  
}

const getDayNumber = (dayName) => {
  // Crear un objeto de mapeo para los días
  const daysMap = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7,
  };
  console.log(dayName)
  // Retornar el número correspondiente o null si no es válido
  return daysMap[dayName] || 0;
};

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
          name="dayOfWeek"
          onChange={(value) => {
            setSelected(ranges.find((range) => range.alias === value[0]));
            setPopoverActive(false);
          } } />
      </Popover></>
  )
}

export default function SettingsPage() {
  const { smUp } = useBreakpoints(); 
  const settings=useLoaderData();

  const [formState, setFormState]=useState(settings);

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
  
  const handleChange = useCallback(
    (_checked, newValue) => {
      setValue(newValue);
  
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

  const DatePickerExample = ({ label, date }) => {
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
                name= { date==="1" ? "dateStart" : "dateEnd"}
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
        </Box>
      </BlockStack>
    )
  }
 
  return (
    <Page divider
    primaryAction={{ content: "View on your store", disabled: true }}
    secondaryActions={[
      {
        content: "Duplicate",
        accessibilityLabel: "Secondary action label",
        onAction: () => alert("Duplicate action"),
      },
    ]}>
      <TitleBar title="Settings page" />
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
              <br></br>
              <InlineStack blockAlign="baseline">
                <Placeholder width="100px" label="Period" strong={true} />
                <RadioButton
                  label="Set indefinitely"
                  helpText="There's no expiration date for receiving products."
                  id="disabled"
                  name="accounts"
                  onChange={handleChange}
                  checked={value === 'disabled' }
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
          {showCardScheduler &&
              <Layout.Section>
                <Card>
                  <Text as="h2" variant="headingSm">
                    Schedule Deliveries
                  </Text>
                  <Box paddingBlockStart="200">
                    <Text as="p" variant="bodyMd">
                      Setup the period you will be receiving your products.
                    </Text>
                  </Box>
                  <br></br>
                  <Divider />
                  <br></br>
                  <Form method="POST">
                  <FormLayout>
                    <FormLayout.Group>
                    <DatePickerExample date="1" value={formState?.dateStart} label="Start date" />
                    <DatePickerExample date="2" value={formState?.dateEnd} label="End date"/>
                    </FormLayout.Group>
                    {/* <TextField label="Times per Week" name="times" value={formState?.times} onChange={(value)=>setFormState({...formState,times:value})}  autoComplete="off" />*/}
                    <DateListPicker value={formState?.dayOfWeek} onChange={(value)=>setFormState({...formState,dayOfWeek:value})}/>
                  </FormLayout>
                  <br></br>
                  <br></br>
                  <Button fullWidth submit={true}>Save</Button>
                  </Form>
                </Card>
              </Layout.Section>
              }
        </Layout>
      </BlockStack>
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
            <BlockStack gap="400">
              <TextField label="App name" value={formState?.name} name="name" onChange={(value)=>setFormState({...formState,name:value})} />
              <TextField label="App description" name="description" value={formState?.description} onChange={(value)=>setFormState({...formState, description:value})}/>
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
