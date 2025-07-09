/** @format */
"use client";

import React from "react";
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location?: string };

const API_KEY =  "d6e80e2b90dd0ef6a409be0dde3d9d6d";

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  //

  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  function handleInputChang(value: string) {
    setCity(value);
  }

  async function handleSuggestionClick(value: string) {
    // Use /weather endpoint to validate and set city
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${API_KEY}`
      );
      if (response.data && response.data.name) {
        setCity(response.data.name);
        setPlace(response.data.name);
      }
    } catch (error) {
      // Do nothing on error
    }
  }

  async function handleSubmiSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      if (response.data && response.data.name) {
        setPlace(response.data.name);
      }
    } catch (error) {
      // Do nothing on error
    }
    setLoadingCity(false);
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      setLoadingCity(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          if (response.data && response.data.name) {
            setPlace(response.data.name);
            setError("");
          } else {
            setError("Location not found");
          }
        } catch (error) {
          setError("Location not found");
        }
        setLoadingCity(false);
      });
    }
  }
  return (
    <>
      <nav className="shadow-sm  sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto">
          <p className="flex items-center justify-center gap-2  ">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </p>
          {/*  */}
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Your Current Location"
              onClick={handleCurrentLocation}
              className="text-2xl  text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdOutlineLocationOn className="text-3xl" />
            <p className="text-slate-900/80 text-sm"> {location} </p>
            <div className="relative hidden md:flex">
              {/* SearchBox */}
              <SearchBox
                value={city}
                onSubmit={handleSubmiSearch}
                onChange={(e) => handleInputChang(e.target.value)}
              />
              {/* No error or suggestion UI */}
            </div>
          </section>
        </div>
      </nav>
      <section className="flex   max-w-7xl px-3 md:hidden ">
        <div className="relative ">
          {/* SearchBox */}
          <SearchBox
            value={city}
            onSubmit={handleSubmiSearch}
            onChange={(e) => handleInputChang(e.target.value)}
          />
          {/* No error or suggestion UI */}
        </div>
      </section>
    </>
  );
}

// SuggetionBox removed: no suggestions needed
