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
  LegacyStack
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState,useCallback, useRef, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData,Form } from "@remix-run/react";
import {
  CalendarIcon, ComposeIcon
} from '@shopify/polaris-icons'
import db from "../db.server";

let dayOfWeekGen=0;

export async function loader() {
  let settings=await db.schedule.findFirst();
  return json(settings);
}

export async function action({request}) {
  let settings = await request.formData();
  settings=Object.fromEntries(settings);
  console.log(settings.dayOfWeek)
  
  if(settings.type==1){
    await db.schedule.create({
      data:{
        shop: "local",
        scheduleType: 1,
        dayOfWeek: getDayNumber(settings.daysOfWeek),
        dateStart: new Date(settings.dateStart),
        dateEnd: new Date(settings.dateEnd),
      }
    });
  }else{
    await db.schedule.create({
      data:{
        shop: "local",
        scheduleType: 2,
        dayOfWeek: getDayNumber(settings.daysOfWeek),
        dateStart: new Date(now()),
        dateEnd: new Date(now()),
      }
    });
  }
  

  return json(settings);
  
  
}

const getDayNumber = (dayName) => {
  // Crear un objeto de mapeo para los días
  switch (dayName){
    case "monday":
      return 1;
    case "tuesday":
      return 2;
    case "wednesday":
      return 3;
    case "thursday":
      return 4;
    case "friday":
      return 5;
    case "saturday":
      return 6;
    case "sunday":
      return 7;
    default: 0;
  }
};

const DateListPicker = ({ onChange }) => {
  const ranges = [
    { title: "Select", alias: "no-date", period: null },
    { title: "Monday", alias: "mon", period: { since: "mon", until: "mon" } },
    { title: "Tuesday", alias: "tue", period: { since: "tue", until: "tue" } },
    { title: "Wednesday", alias: "wed", period: { since: "wed", until: "wed" } },
    { title: "Thursday", alias: "thu", period: { since: "thu", until: "thu" } },
    { title: "Friday", alias: "fri", period: { since: "fri", until: "fri" } },
    { title: "Saturday", alias: "sat", period: { since: "sat", until: "sat" } },
    { title: "Sunday", alias: "sun", period: { since: "sun", until: "sun" } },
  ];

  const [selected, setSelected] = useState(ranges[0]);
  const [popoverActive, setPopoverActive] = useState(false);  // Aquí defines popoverActive

  const handleSelectChange = (value) => {
    setSelected(ranges.find((range) => range.alias === value[0]));
    onChange(value[0]);  // Llamamos a onChange para actualizar el valor en el componente padre
    setPopoverActive(false);  // Cierra el Popover al seleccionar una opción
  };

  return (
    <Popover
      active={popoverActive}
      onClose={() => setPopoverActive(false)}
      activator={<Button icon={CalendarIcon} onClick={() => setPopoverActive(!popoverActive)}>{selected.title} </Button>}
    >
      <OptionList
        options={ranges.map((range) => ({ value: range.alias, label: range.title }))}
        selected={selected.alias}
        onChange={handleSelectChange}
        onClick={() => { dayOfWeekGen = selected.alias; }}
        name="dayOfWeek"
      />
    </Popover>
  );
};

function DaySelector({ selectedDay, onDayChange }) {
  const daysOfWeek = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ];

  return (
    <LegacyStack vertical>
      {daysOfWeek.map((day) => (
        <RadioButton
          key={day.value}
          label={day.label}
          checked={selectedDay === day.value} // Marca el seleccionado
          id={day.value}
          name="daysOfWeek"
          value={day.value}
          onChange={() => onDayChange(day.value)} // Llama al callback del padre
        />
      ))}
    </LegacyStack>
  );
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

  const handleDayOfWeekChange = (newDay) => {
    setFormState((prevState) => ({
      ...prevState,
      dayOfWeek: newDay, // Actualizar el estado con el nuevo día de la semana
    }));
  };

  const [value, setValue] = useState('disabled');
  const [showCardScheduler, setShowCardScheduler] = useState(false);
  const [showCardUnlimited, setShowCardUnlimited] = useState(true);
  
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

  const [valueDay, setValueDay] = useState('disabled');

  const handleChangeDay = useCallback(
    (newValue) => setValue(newValue),  // Actualiza el valor seleccionado
    [],
  );

  const [selectedDay, setSelectedDay] = useState('monday'); // Estado en el padre

  const handleDayChange = useCallback((day) => {
    setSelectedDay(day); // Actualiza el estado
  }, []);

  const handleSave = () => {
    console.log(`Selected day: ${selectedDay}`);
    dayOfWeekGen = getDayNumber(selectedDay);
    settings.daysOfWeek=selectedDay;
  };
  
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
                  </FormLayout>
                  <br></br>
                  <Box paddingBlockStart="200">
                    <Text as="p" variant="bodyMd">
                      Select the day of the week you want to receive you products.
                    </Text>
                  </Box>
                  <br></br>
                  <DaySelector value={formState?.daysOfWeek} />
                  
                  <TextField value={formState?.type} type="hidden"/>
                  <Button fullWidth submit={true} >Save</Button>
                  </Form>
                </Card>
              </Layout.Section>
              }
              {showCardUnlimited &&
              <Layout.Section>
                <Card>
                  <Text as="h2" variant="headingSm">
                    Schedule Deliveries
                  </Text>
                  <Box paddingBlockStart="200">
                    <Text as="p" variant="bodyMd">
                      Setup the day you will receive you products with no time limit.
                    </Text>
                  </Box>
                  <br></br>
                  <Divider />
                  <br></br>
                  <Form method="POST">
                  <FormLayout>
                    {/* <TextField label="Times per Week" name="times" value={formState?.times} onChange={(value)=>setFormState({...formState,times:value})}  autoComplete="off" />*/}
                    <DaySelector selectedDay={selectedDay} onDayChange={handleDayChange} />
                  </FormLayout>
                  <br></br>
                  <br></br>
                  <TextField value={formState?.type=1} type="hidden"/>
                  <Button fullWidth submit={true} onClick={handleSave} >Save</Button>
                  </Form>
                </Card>
              </Layout.Section>
              }
        </Layout>
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
