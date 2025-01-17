import {LegacyStack, RadioButton} from '@shopify/polaris';
import {useState, useCallback} from 'react';

function DaySelector() {
  const [selectedDay, setSelectedDay] = useState('monday'); // Día seleccionado inicial

  // Función para manejar la selección
  const handleChange = useCallback(
    (day) => setSelectedDay(day),
    [],
  );

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
          checked={selectedDay === day.value} // Verifica si el día está seleccionado
          id={day.value}
          name="daysOfWeek" // Todos los radio buttons tienen el mismo 'name'
          value={day.value} // Valor único para cada día
          onChange={() => handleChange(day.value)} // Actualiza el estado al seleccionar
        />
      ))}
    </LegacyStack>
  );
}

export default DaySelector;
