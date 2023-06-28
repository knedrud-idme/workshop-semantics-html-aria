import React, { useEffect, useRef, useState } from "react"
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import { createActiveMonthDays, createPrevMonthDays, createNextMonthDays } from './utils'
import "./date-picker.scss"

const DatePicker = ({monthsInAdvance = 2, currDate}) => {
    dayjs.extend(weekday)
    dayjs.extend(weekOfYear)

    // set date to 3 months from now
    let date = new Date()
    date.setMonth(date.getMonth() + monthsInAdvance)

    // keep the active, visible date in State
    let [activeDate, setActiveDate] = useState(dayjs(date))
    const startYear = dayjs(activeDate).format("YYYY")
    const startMonth = dayjs(activeDate).format("M")

    // this collection of dates would come from a database, etc.
    let initUnavailableDates = ['2023-08-10', '2023-08-11', '2023-08-12', '2022-04-11', '2022-04-12', '2022-04-14', '2022-04-15', '2022-04-17', '2022-04-18', '2022-04-19', '2022-04-24', '2022-04-25', '2022-04-27']
    let activeMonthDays = createActiveMonthDays(startYear, startMonth, initUnavailableDates)
    let prevMonthDays = createPrevMonthDays(startYear, startMonth, activeMonthDays, initUnavailableDates)
    let nextMonthDays = createNextMonthDays(startYear, startMonth, activeMonthDays, initUnavailableDates)
    let prevMonth = dayjs(activeDate).subtract(1, "month")
    let nextMonth = dayjs(activeDate).add(1, "month")

    let days = [...prevMonthDays, ...activeMonthDays, ...nextMonthDays]
    let weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        let week = days.slice(i, i + 7);
        weeks.push(week);
    }

    let [unavailableDates, setUnavailableDates] = useState(initUnavailableDates)
    let [selectedDates, setSelectedDates] = useState([])

    const setPrevMonth = () => {
        // only go backward as far as current month
        if (isPrevMonthAvailable()) {
            setActiveDate(dayjs(activeDate).subtract(1, "month"))
        }
    }
    const setNextMonth = () => {
        setActiveDate(dayjs(activeDate).add(1, "month"))
    }
    const isPrevMonthAvailable = () => {
        return dayjs(activeDate).subtract(1, 'month').get('month') >= dayjs().get('month')
    }
    const isDayUnavailable = (day) => {
        return unavailableDates.includes(day.date)
    }
    const bookDay = (day) => {
        // this function would run on "Reserve"
        setUnavailableDates(
            unavailableDates => [day.date, ...unavailableDates, `${unavailableDates.length}`]
        )
    }
    const isDaySelected = (day) => {
        return selectedDates.includes(day.date)
    }
    const selectDay = (day) => {
        // to-do: consider perf of this for large quanitites of dates
        if (!isDayUnavailable(day)) {
            // add to selected Dates if not already selected
            if (!isDaySelected(day)) {
                setSelectedDates(
                    selectedDates => [day.date, ...selectedDates]
                )
            } else {
                setSelectedDates(
                    selectedDates.filter(date => date !== day.date)
                )
            }
        }
    }
    return (
        <form>
            <div className="date-picker">
                <header>
                    <h3 id="date-picker-current-month">{ dayjs(activeDate).format("MMMM YYYY") }</h3>
                    <button
                        className="btn-month btn-prev"
                        disabled={isPrevMonthAvailable() ? '' : 'disabled'}
                        onClick={setPrevMonth}
                        aria-label={`Previous Month: ${prevMonth.format("MMMM")}`}
                    >
                        <span></span>
                        {prevMonth.format("MMM")}
                    </button>
                    <button
                        className="btn-month btn-next"
                        onClick={setNextMonth}
                        aria-label={`Next Month: ${nextMonth.format("MMMM")}`}
                    >
                        {nextMonth.format("MMM")}
                        <span></span>
                    </button>
                </header>
                <table aria-labelledby="date-picker-current-month">
                    <thead className="days-of-week">
                        <tr>
                            <th title="Sunday" scope="col">S</th>
                            <th title="Monday" scope="col">M</th>
                            <th title="Tuesday" scope="col">T</th>
                            <th title="Wednesday" scope="col">W</th>
                            <th title="Thursday" scope="col">T</th>
                            <th title="Friday" scope="col">F</th>
                            <th title="Saturday" scope="col">S</th>
                        </tr>
                    </thead>
                    <tbody className="date-grid">
                        {weeks.map((week, weekIndex) => {
                            return <tr key={weekIndex}>
                                {week.map((day, index) => {
                                    return <td
                                        className="grid-day"
                                        key={index}
                                    >
                                        <label className={[
                                            'grid-btn',
                                            day.isBooked ? 'booked' : '',
                                            day.isCurrentMonth ? 'currentMonth' : '',
                                            isDaySelected(day) ? 'selected' : ''
                                        ].join(' ').trim()}>
                                            <time date-time={day.date}>{day.dayOfMonth}</time>
                                            <span className="icon" aria-hidden="true"></span>
                                            <input
                                                type="checkbox"
                                                name="day"
                                                value={day.date}
                                                disabled={day.isBooked}
                                                checked={isDaySelected(day) ? 'checked' : null}
                                                onChange={() => selectDay(day)}
                                                className="visually-hidden"
                                                aria-label={`${dayjs(day.date).format('ddd MMM D')} ${day.isBooked ? '(Unavailable)' : ''}`}
                                            />
                                        </label>
                                    </td>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
                <div className="date-key">
                    <div className="date-key-item-wrap">
                        <span className="date-key-item booked">
                            <span className="icon" aria-hidden="true"></span>
                        </span>
                        <span className="date-key-text">Booked</span>
                    </div>
                    <div className="date-key-item-wrap">
                        <span className="date-key-item available">
                            <span className="icon" aria-hidden="true"></span>
                        </span>
                        <span className="date-key-text">Available</span>
                    </div>
                    <div className="date-key-item-wrap">
                        <span className="date-key-item selected">
                            <span className="icon" aria-hidden="true"></span>
                        </span>
                        <span className="date-key-text">Selected</span>
                    </div>
                </div>
                <button className="reserve-btn">Reserve</button>
            </div>
        </form>
    )
}

export default DatePicker
