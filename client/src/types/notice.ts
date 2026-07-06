// A Snackbar message: what kind it is (drives its color) and its text.
export type NoticeType = "success" | "error";

export interface Notice {
  type: NoticeType;
  message: string;
}
