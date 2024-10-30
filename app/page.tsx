'use client';

import { useQuery } from 'react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import contentfulConfig from './contentful/contentfulConfig';
import { generateUniqueRandomNumbers } from './lib/utils/UniqueRandomNumber';
import { useMemo, useState, useEffect } from 'react';
import LoadingSkeleton from './components/LoadingSkeleton';
import styles from './page.module.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CircularProgress } from '@nextui-org/react';
import 'react-circular-progressbar/dist/styles.css';
import { HiArrowSmRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Button } from '@nextui-org/react';
import ResultsModal from './shared/ResultsModal';

type fields = {
  id: number;
  question: string;
  answers: string[];
  rightAnswer: string;
};

type QuizData = {
  fields: fields;
};

const HomePage = () => {
  const { data, isLoading, isError } = useQuery<QuizData[]>(
    'contentfulData',
    fetchQuizData
  );

  async function fetchQuizData() {
    try {
      const { spaceId, accessToken } = contentfulConfig;
      const response = await axios.get(
        `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}`
      );

      return response.data.items;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        'Error fetching data from Contentful: ' + axiosError.message
      );
    }
  }

  const uniqueRandomNumbers: number[] = useMemo(
    generateUniqueRandomNumbers,
    []
  );

  const [questionCount, setQuestionCount] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectAnswer] = useState<undefined | string>();
  const [randomNumbersArrayIndex, setRandomNumbersArrayIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [time, setTime] = useState(80);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [feedback, setFeedback] = useState<
    {
      question: string;
      rightAnswer: string;
      userChoice: string;
      questionNumber: number;
    }[]
  >([]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  function selectedAnswerHandler(answer: string) {
    setSelectAnswer(answer);
  }

  function nextQuestionButtonHandler() {
    setSelectAnswer(undefined);
    setProgressValue(progressValue + 10);
    setRandomNumbersArrayIndex(
      randomNumbersArrayIndex => randomNumbersArrayIndex + 1
    );
    setCurrentQuestion(uniqueRandomNumbers[randomNumbersArrayIndex]);
    setQuestionCount(questionCount => questionCount + 1);

    if (data && selectedAnswer === data[currentQuestion].fields.rightAnswer) {
      setCorrectAnswersCount(correctAnswerCount => correctAnswerCount + 1);
    }
    if (
      data &&
      selectedAnswer &&
      selectedAnswer !== data[currentQuestion].fields.rightAnswer
    ) {
      setFeedback(prevState => [
        ...prevState,
        {
          question: data[currentQuestion]?.fields.question,
          rightAnswer: data[currentQuestion].fields.rightAnswer,
          userChoice: selectedAnswer,
          questionNumber: questionCount,
        },
      ]);
    }
  }

  function restartQuiz() {
    setCorrectAnswersCount(0);
    setCurrentQuestion(0);
    setQuestionCount(1);
    setSelectAnswer(undefined);
    setRandomNumbersArrayIndex(0);
    setProgressValue(0);
    setTime(80);
  }

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <div>Error fetching data from Contentful.</div>;
  }

  return (
    <main className="bg-[#183D3D] flex flex-col justify-center h-screen text-lg">
      {questionCount > data.length || time <= 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 items-center shadow-2xl rounded-md p-10 w-11/12 max-w-[500px] mx-auto text-white bg-[#062C30] "
        >
          <h1 className="border-b-2 border-white">RESULTS</h1>
          <div className="flex gap-4 items-center">
            <p className="inline-flex items-center gap-2">
              Quiz completion rate <HiArrowSmRight className="w-5 h-5" />{' '}
            </p>
            <CircularProgress
              classNames={{
                svg: 'w-16 h-16',
                indicator: 'stroke-white',
                value: 'text-sm font-semibold',
              }}
              aria-label="Loading..."
              size="lg"
              value={progressValue}
              color="warning"
              showValueLabel={true}
            />
          </div>
          <h2>
            {' '}
            You have answered{' '}
            <span className="font-semibold border-b-2 border-teal-300">
              {correctAnswersCount}
            </span>{' '}
            out of 10 questions correctly
          </h2>

          <div className="flex items-center gap-4">
            <ResultsModal
              modalTitle="Detailed Results"
              feedback={feedback}
              closeButtonText="Close"
              openModalButtonText="Open detailed feedback"
            />
            <Button
              className="text-sm md:text-base bg-[#183D3D] text-white"
              onClick={restartQuiz}
            >
              Restart
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`${styles.card} grid gap-8 shadow-2xl rounded-lg p-10 w-11/12 max-w-[500px] mx-auto text-white/90 bg-[#062C30] `}
        >
          <h2 className="text-base md:text-lg text-yellow-500 ">
            {' '}
            {questionCount}. {data[currentQuestion]?.fields.question}{' '}
          </h2>
          <div className="flex flex-col gap-4">
            {data[currentQuestion]?.fields.answers.map(answer => (
              <button
                key={answer}
                className={`border-3 p-2 rounded-lg transition text-center cursor-pointer text-sm md:text-base  ${
                  selectedAnswer === answer
                    ? 'border-teal-500 bg-white text-lime-950'
                    : 'border-white/50 hover:border-teal-300'
                }`}
                onClick={() => {
                  selectedAnswerHandler(answer);
                }}
              >
                {answer}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5">
            <CircularProgress
              classNames={{
                svg: 'w-16 h-16',
                indicator: 'stroke-white',
                value: 'text-sm font-semibold',
              }}
              aria-label="Loading..."
              size="lg"
              value={progressValue}
              color="warning"
              showValueLabel={true}
            />
            <button
              disabled={selectedAnswer ? false : true}
              onClick={nextQuestionButtonHandler}
              className={`${
                selectedAnswer
                  ? 'bg-white border-2 border-transparent text-lime-950'
                  : 'border-red-600 border-2 text-white'
              } col-span-3 w-fit place-self-center bg-transparent  text-sm md:text-base hover:shadow-xl border-teal-700 py-3 px-4 rounded-md ease-in duration-150 disabled:cursor-not-allowed disabled:shadow-none`}
            >
              {questionCount === 10 ? 'Finish Quiz' : 'Next Question'}
            </button>

            <CircularProgressbar
              className="w-16 h-16"
              value={time}
              minValue={0}
              maxValue={80}
              text={`${time}`}
              strokeWidth={12}
              styles={buildStyles({
                textSize: '22px',
                trailColor: '#d6d6d6',
                textColor: '#fff',
                pathColor: '#186F65',
              })}
            />
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default HomePage;
