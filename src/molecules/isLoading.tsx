import React from 'react';

export default function IsLoading() {
    return (
        <div className="container relative mt-24 flex-col items-center justify-center lg:max-w-none lg:px-0">
            <div className="lg:p-8 w-full">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Cargando...
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}