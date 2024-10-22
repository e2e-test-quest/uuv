import { onMounted } from "vue";
import * as bootstrap from "bootstrap";

export function createTooltips() {
    onMounted(() => {    
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
          new bootstrap.Tooltip(tooltipTriggerEl);
        });
    });
}