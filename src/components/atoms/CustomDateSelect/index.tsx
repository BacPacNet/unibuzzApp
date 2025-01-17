import dayjs from "dayjs";
import { Calendar } from "iconoir-react-native";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DatePicker, { DateType } from "react-native-ui-datepicker";

interface SelectDropdownProps {
  onChangeText: (value: any) => void;
  value: any;
  placeholder?: string;
  err: boolean;
}

const DateSelect = ({
  onChangeText,
  value,
  placeholder,
  err,
}: SelectDropdownProps) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | any>(value);

  const handleDateChange = (data: DateType) => {
    setSelectedDate(data?.toString());
    onChangeText(data?.toString());
    setShow(false);
  };

  const dateObject = new Date(selectedDate);
  const validDate = !isNaN(dateObject.getTime())
    ? dayjs(dateObject.toISOString())
    : dayjs();

  return (
    <View className="relative ">
      <TouchableOpacity
        style={{ padding: 12 }}
        onPress={() => setShow(!show)}
        className={`flex-row justify-between items-center  border rounded-lg drop-shadow-sm h- ${
          err ? "border-red-400" : "border-neutral-300"
        }`}
      >
        <Text
          className={`${selectedDate ? "text-neutral-900" : "text-neutral-400"}`}
        >
          {selectedDate
            ? dayjs(selectedDate).format("DD-MM-YYYY")
            : placeholder}
        </Text>
        <Calendar width={20} height={20} color={"#d4d4d4"} />
      </TouchableOpacity>

      {show && (
        <View
          style={{ top: 48 }}
          className="absolute  left-0 w-full z-10 bg-white shadow-lg rounded-lg"
        >
          <DatePicker
            mode="single"
            date={validDate}
            onChange={(params) => handleDateChange(params.date)}
          />
        </View>
      )}
    </View>
  );
};

export default DateSelect;
