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
  onConfirm?: () => void;
  showCancel?: boolean;
  confirmLabel?: string;
};

const ModalConfirm = (props: ModalConfirmProps) => {
  const {
    type = "info",
    title,
    message,
    visible = false,
    onClose,
    onConfirm,
    showCancel = false,
    confirmLabel,
  } = props;
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

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md text-center sm:text-center">
        <DialogHeader className="items-center pt-6">
          {
            {
              info: <CheckInfoIcon />,
              warning: <CheckWarningIcon />,
              error: <CheckErrorIcon />,
            }[type]
          }
          <DialogTitle className="mt-2 text-2xl font-bold text-gray-800">
            {title || t("modal.confirmTitle")}
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm text-gray-600">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row sm:justify-center">
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="mt-2 h-10 flex-[2] rounded-md text-sm font-semibold tracking-wide"
            >
              {t("common.cancel")}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleConfirm}
            className={cn(
              "mt-2 h-10 rounded-md px-6 text-sm font-semibold tracking-wide text-white",
              showCancel ? "flex-1" : "w-full",
              colorClass,
            )}
          >
            {confirmLabel || t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ModalConfirm);
