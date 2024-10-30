import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ModalProps,
} from '@nextui-org/react';
import React, { useState } from 'react';

type FeedbackProps = {
  question: string;
  rightAnswer: string;
  userChoice: string;
  questionNumber: number;
};

type ResultsModalProps = {
  modalTitle: string;
  closeButtonText: string;
  openModalButtonText: string;
  feedback: FeedbackProps[];
};

const ResultsModal = ({
  modalTitle,
  feedback,
  closeButtonText,
  openModalButtonText,
}: ResultsModalProps) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] =
    useState<ModalProps['scrollBehavior']>('inside');

  return (
    <>
      <Button className="text-sm md:text-base" onPress={onOpen}>
        {openModalButtonText}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalTitle}
              </ModalHeader>
              <ModalBody className="bg-[#183D3D] text-white/80 pr-0 pl-6">
                <div className="modal-scroll">
                  {feedback.map(item => (
                    <div key={item.question} className="mb-4">
                      <h2 className="mb-2 font-medium">
                        {' '}
                        {item.questionNumber}. {item.question}
                      </h2>
                      <p className="mb-1 font-light">
                        Correct answer: {item.rightAnswer}
                      </p>
                      <p className="font-light">
                        Your answer: {item.userChoice}
                      </p>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {closeButtonText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ResultsModal;
