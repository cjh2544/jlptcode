"use client"; // 필수!
import { useState, useEffect, Suspense } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import WordLayout from '@/app/components/Layout/WordLayout'
import { Button, Card, CardBody, Carousel, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";
import useWord from '@/app/swr/useWord';
import WordContent from './components/WordContent';
import SearchBar from './components/SearchBar';
import Loading from '@/app/components/Loading/loading';

const SlidePage = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const [conditions, setConditions] = useState({});
  
  const handleSearch = (data: any) => {
    setConditions(data);
  }

  const handleOpen = () => setOpen(!open);

  // const handlePageChange = (page: number) => {
  //   setConditions({...conditions, page});
  // }

  return (
    <WordLayout>
      <SearchBar onSearch={(data: any) => handleSearch(data)} />

      <div onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} className="w-full h-auto relatives">
        <Suspense fallback={<Loading />}>
          <WordContent conditions={conditions} />
        </Suspense>
      </div>
    </WordLayout>
  )
}

export default SlidePage