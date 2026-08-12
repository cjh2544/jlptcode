"use client";

import React, { memo, useMemo } from "react";
import CheckInfoIcon from "../Icons/CheckInfo";
import CheckWarningIcon from "../Icons/CheckWarning";
import CheckErrorIcon from "../Icons/CheckError";
import { useTranslations } from "@/app/providers/I18nProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalConfirmProps = {
  type?: "info" | "error" | "warning";
  title?: string;
  message: any;
  visible: boolean;
  onClose: (visible: boolean) => void;
};

const ModalConfirm = (props: ModalConfirmProps) => {
  const { type = "info", title, message, visible = false, onClose } = props;
  const { t } = useTranslations();

  const colorClass = useMemo(
    () =>
      ({
        info: "bg-blue-500 hover:bg-blue-600",
        warning: "bg-orange-500 hover:bg-orange-600",
        error: "bg-red-500 hover:bg-red-600",
      })[type],
    [type],
  );

  const handleClose = () => {
    onClose?.(false);
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md text-center sm:text-center">
        <DialogHeader className="items-center">
          {
            {
              info: <CheckInfoIcon />,
              warning: <CheckWarningIcon />,
              error: <CheckErrorIcon />,
            }[type]
          }
          <DialogTitle className="text-gray-800 text-2xl font-bold mt-4">
            {title || t("modal.confirmTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-3">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={handleClose}
            className={cn(
              "px-6 py-2.5 mt-2 w-full rounded-md text-white text-sm font-semibold tracking-wide",
              colorClass,
            )}
          >
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ModalConfirm);
