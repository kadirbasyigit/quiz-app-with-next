'use client';

import { useQuery } from 'react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import contentfulConfig from './contentful/contentfulConfig';
import { generateUniqueRandomNumbers } from './lib/utils/UniqueRandomNumber';
import { useMemo } from 'react';
import LoadingSkeleton from './components/LoadingSkeleton';

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

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <div>Error fetching data from Contentful.</div>;
  }

  return <div>hi</div>;
};

export default HomePage;
