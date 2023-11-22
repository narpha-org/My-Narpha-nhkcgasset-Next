"use client";

import { Loader } from "@/components/ui/loader";


const Loading = () => {
  return (
    <div className="" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      marginTop: '40vh'
    }}>
      <Loader />
    </div>
  );
}

export default Loading;