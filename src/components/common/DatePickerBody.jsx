import React, { useMemo } from "react";
import VerticalPicker from "./VerticalPicker";
import { Box } from "@mui/material";

/**
 * @param {number} maxDayOffset - 0 = allow up to today, -1 = allow up to yesterday (for commission pages where today's data isn't ready)
 */
const DatePickerBody = ({ year, month, day, daysInMonth, setYear, setMonth, setDay, maxDayOffset = 0 }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const todayDay = currentDate.getDate();
  const effectiveMaxDay = todayDay + maxDayOffset; // e.g. -1 => yesterday as max (0 on 1st = no valid days)

  // Generate year options from 5 years ago up to current year
  const yearOptions = useMemo(() => {
    const startYear = currentYear - 5;
    return [0, ...Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)];
  }, [currentYear]);

  // Generate month options - if maxDayOffset < 0 and today is 1st, exclude current month (no yesterday in it)
  const monthOptions = useMemo(() => {
    let maxMonth = 12;
    if (year === currentYear) {
      maxMonth = maxDayOffset < 0 && effectiveMaxDay <= 0 ? currentMonth - 1 : currentMonth;
    }
    return [0, ...Array.from({ length: Math.max(1, maxMonth) }, (_, i) => i + 1)];
  }, [year, currentYear, currentMonth, effectiveMaxDay, maxDayOffset]);

  // Generate day options - for current month with maxDayOffset, cap at effectiveMaxDay (yesterday)
  const dayOptions = useMemo(() => {
    if (!daysInMonth || !daysInMonth.length) return [0];

    if (year === currentYear && month === currentMonth) {
      const maxD = Math.max(0, effectiveMaxDay);
      if (maxD === 0) return [0];
      return [0, ...Array.from({ length: maxD }, (_, i) => i + 1)];
    }
    return [0, ...Array.from({ length: daysInMonth.length }, (_, i) => i + 1)];
  }, [year, month, currentYear, currentMonth, effectiveMaxDay, daysInMonth]);

  // Handle month change to ensure valid date
  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    const maxDays =
      year === currentYear && newMonth === currentMonth
        ? Math.max(1, effectiveMaxDay)
        : new Date(year, newMonth, 0).getDate();

    if (day > maxDays) {
      setDay(maxDays);
    }
  };

  // Handle year change to ensure valid date
  const handleYearChange = (newYear) => {
    setYear(newYear);

    if (newYear === currentYear) {
      if (month > currentMonth) {
        setMonth(currentMonth);
      }
      const maxD = month === currentMonth ? Math.max(1, effectiveMaxDay) : new Date(newYear, month, 0).getDate();
      if (day > maxD) {
        setDay(maxD);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        backgroundColor: "#232626", // Updated background color
      }}
    >
      <VerticalPicker initialValue={year} onChange={handleYearChange} options={yearOptions} />
      <VerticalPicker initialValue={month} onChange={handleMonthChange} options={monthOptions} />
      <VerticalPicker initialValue={day} onChange={setDay} options={dayOptions} />
    </Box>
  );
};

export default DatePickerBody;