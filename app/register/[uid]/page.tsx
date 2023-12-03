import React from 'react';

interface UserPageProps {
    params: {
        uid: string;
    };
}

const HelloWorld = ( {params} : UserPageProps) => {
  return (
    <div>
        <h1 className='align-middle'>Hello world from {params.uid} </h1>
    </div>
  )
}

export default HelloWorld;