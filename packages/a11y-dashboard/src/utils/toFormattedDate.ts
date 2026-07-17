import moment from "moment";
import { DEFAULT_DATE_FORMAT } from "../models";

export default function toFormattedDate(unix_timestamp: number): string {
    return moment(new Date(unix_timestamp)).format(DEFAULT_DATE_FORMAT);
}
