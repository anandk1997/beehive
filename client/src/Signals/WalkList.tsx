import { signal } from "@preact/signals-react";

export const searchedValue = signal("");
export const walListError = signal("");
export const search = signal("");
export const page = signal(1);

export const onChange = (e: any) => {
  if (e.key === "Enter") {
    searchedValue.value = search.value;
    page.value = 1;
  }
  search.value = e.target.value;
};
