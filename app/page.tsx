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
import { GiCheckMark } from 'react-icons/gi';
import { HiArrowSmRight } from 'react-icons/hi';

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
  // ?DATA FETCHING
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

  // ?TAKE AND STORE UNİQUE RANDOM NUMBERS ARRAY
  const uniqueRandomNumbers: number[] = useMemo(
    generateUniqueRandomNumbers,
    []
  );

  const [questionCount, setQuestionCount] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectAnswer] = useState<undefined | string>();
  const [randomNumbersArrayIndex, setRandomNumbersArrayIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [time, setTime] = useState(120);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

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
  }

  function restartQuiz() {
    setCorrectAnswersCount(0);
    setCurrentQuestion(0);
    setQuestionCount(1);
    setSelectAnswer(undefined);
    setRandomNumbersArrayIndex(0);
    setProgressValue(0);
    setTime(120);
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
        <div className="flex flex-col gap-8 items-center shadow-2xl rounded-md p-10 w-11/12 max-w-[500px] mx-auto text-white">
          <h1 className="border-b-2 border-red-500 border-dashed">RESULTS</h1>
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
          <button
            className="border-2 border-teal-600 mx-auto py-2 px-4 rounded-md hover:shadow-xl transition"
            onClick={restartQuiz}
          >
            Restart
          </button>
        </div>
      ) : (
        <div
          className={`${styles.card} grid gap-8 shadow-2xl rounded-lg p-10 w-11/12 max-w-[500px] mx-auto text-white/90`}
        >
          <h2 className="text-base md:text-lg">
            {' '}
            {questionCount}. {data[currentQuestion]?.fields.question}{' '}
          </h2>
          <div className="flex flex-col gap-4">
            {data[currentQuestion]?.fields.answers.map(answer => (
              <div
                key={answer}
                className={`border-3 p-2 rounded-lg transition flex items-center cursor-pointer  ${
                  selectedAnswer === answer
                    ? 'border-teal-500'
                    : 'border-white/50 hover:border-teal-300'
                }`}
                onClick={() => {
                  selectedAnswerHandler(answer);
                }}
              >
                <button className="mx-auto text-sm md:text-base">
                  {' '}
                  {answer}
                </button>
                {selectedAnswer === answer && (
                  <GiCheckMark className="w-5 h-5" />
                )}
              </div>
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
              Next Question
            </button>

            <CircularProgressbar
              className="w-16 h-16"
              value={time}
              minValue={0}
              maxValue={120}
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
        </div>
      )}
    </main>
  );
};

export default HomePage;
