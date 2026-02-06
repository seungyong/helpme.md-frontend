import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

const Modal = ({
  isOpen,
  onRequestClose,
  children,
  width = "35rem",
  height = "fit-content",
}: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      closeTimeoutMS={200}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          position: "absolute",
          top: "50%",
          transform: "translate(0, -50%)",
          width: width,
          height: height,
          margin: "0 auto",
          backgroundColor: "#020617",
          borderColor: "#24283A",
          borderRadius: "6px",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
