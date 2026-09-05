export function isSameCalendarDay(
    firstDate: string,
    secondDate: string,
){
    const first = new Date(firstDate);
    const second = new Date(secondDate);

    return(
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    )
}