import React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-gray-900 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <img
            src="/beekeeper-hero.jpg"
            alt="Beekeeper at work"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Our Sweet Story
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            From the flowering valleys of Wicklow to your kitchen table.
            Discover how we keep it pure, organic, and full of love.
          </p>
        </div>
      </div>

      {/* --- OUR MISSION --- */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
              Preserving Nature's Gold
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              HoneyPot started with a simple mission: to provide raw,
              unprocessed honey while protecting the bee populations that make
              our world bloom.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Most supermarket honey is ultra-filtered and pasteurized, killing
              the natural enzymes and flavor. We do things differently. We work
              with local artisan beekeepers who treat their hives with respect,
              ensuring that every jar is as natural as the day it was made.
            </p>
            <div className="flex gap-4">
              <div className="border-l-4 border-honey-gold pl-4">
                <h4 className="font-bold text-gray-900">100% Raw</h4>
                <p className="text-sm text-gray-500">
                  Never heated above hive temperature.
                </p>
              </div>
              <div className="border-l-4 border-honey-gold pl-4">
                <h4 className="font-bold text-gray-900">Ethical</h4>
                <p className="text-sm text-gray-500">
                  We leave enough honey for the bees.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="/honey-jar.jpg"
              alt="Honey Jar"
              className="rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition duration-500"
            />
          </div>
        </div>
      </div>

      {/* --- THE PROCESS --- */}
      <div className="bg-yellow-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            From Hive to Home
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-6xl mb-4">🌸</div>
              <h3 className="text-xl font-bold mb-2">1. Foraging</h3>
              <p className="text-gray-600">
                Our bees visit millions of wildflowers across organic meadows,
                collecting the finest nectar.
              </p>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-6xl mb-4">🐝</div>
              <h3 className="text-xl font-bold mb-2">2. Harvesting</h3>
              <p className="text-gray-600">
                We harvest by hand, using traditional methods that disturb the
                colony as little as possible.
              </p>
            </div>
            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-6xl mb-4">🥄</div>
              <h3 className="text-xl font-bold mb-2">3. Bottling</h3>
              <p className="text-gray-600">
                The honey is cold-filtered (never heated!) and bottled
                immediately to lock in the flavor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA --- */}
      <div className="text-center py-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Taste the Difference
        </h2>
        <Link
          to="/shop"
          className="inline-block bg-honey-gold text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition transform duration-300"
        >
          Browse Our Shop
        </Link>
      </div>
    </div>
  );
};

export default About;
