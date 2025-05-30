import type { ResultCount } from "../models";

export default function getThemeFromResultCount(resultCount?: ResultCount): string {
    if(resultCount) {
        if (resultCount?.error > 0) {
            return 'danger';
        } else if (resultCount?.warning > 0) {
            return 'warning';
        } if (resultCount?.notice > 0) {
            return 'primary';
        }
    }
    return 'secondary';
}
