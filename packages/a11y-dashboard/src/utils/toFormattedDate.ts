import moment from "moment";
import { DEFAULT_DATE_FORMAT } from "../models";

function toMillis(unix_timestamp: number): number {
    return unix_timestamp*1000;
}

export default function toFormattedDate(unix_timestamp: number): string {
    return moment(new Date(toMillis(unix_timestamp))).format(DEFAULT_DATE_FORMAT);
}
