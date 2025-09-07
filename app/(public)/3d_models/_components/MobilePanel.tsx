"use client";
import React from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import clsx from "clsx";

export default function MobilePanel({
  presets,
  presetKey,
  onSelectPreset,
  custom,
  setCustom,
  protons,
  setProtons,
  neutrons,
  setNeutrons,
  electrons,
  setElectrons,
}: any) {
  return (
    <div className="w-full flex justify-center md:hidden">
      <div className="flex items-center justify-between gap-3 text-xs bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-md">
        {/* Preset Dropdown */}
        {/* <select
          className="rounded-md bg-white/10 border border-white/30 px-2 py-1 text-xs text-white/90 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          value={String(presetKey)}
          onChange={(e) =>
            onSelectPreset(e.target.value as keyof typeof presets)
          }
          disabled={custom}
        >
          {Object.keys(presets).map((k) => (
            <option
              key={k}
              value={k}
              className="bg-[#333333] border-3xl text-white"
            >
              {k}
            </option>
          ))}
        </select> */}
        <Listbox
          value={presetKey}
          onChange={onSelectPreset}
        >
          <ListboxButton
            className={clsx(
              "relative h-[28px] w-full rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1 pr-8 text-left text-sm text-white shadow-md",
              "border border-white/20 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            )}
          >
            {presetKey}
            <ChevronDownIcon
              className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4 text-white/60"
              aria-hidden="true"
            />
          </ListboxButton>

          <ListboxOptions
            anchor="bottom"
            transition
            className={clsx(
              "mt-1 w-(--button-width) rounded-xl border border-white/10 bg-[#222]/80 backdrop-blur-md p-1 shadow-lg",
              "focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0"
            )}
          >
            {Object.keys(presets).map((k) => (
              <ListboxOption
                key={k}
                value={k}
                className="group flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white hover:bg-white/10 data-selected:bg-emerald-500/20"
              >
                <CheckIcon className="invisible h-4 w-4 text-emerald-400 group-data-selected:visible" />
                <span>{k}</span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>

        {/* Toggle */}
        <label className="inline-flex items-center gap-1 cursor-pointer text-white/80 hover:text-emerald-300 transition-colors">
          <input
            type="checkbox"
            className="form-checkbox rounded accent-emerald-500 w-3 h-3"
            checked={custom}
            onChange={(e) => setCustom(e.target.checked)}
          />
          <span className="tracking-wide font-medium">Custom</span>
        </label>

        {/* Inputs compact */}
        <div className="flex gap-2">
          {[
            { label: "P", value: protons, set: setProtons, max: 60 },
            { label: "N", value: neutrons, set: setNeutrons, max: 80 },
            { label: "E", value: electrons, set: setElectrons, max: 40 },
          ].map((item, i) => (
            <div key={i} className="relative">
              <input
                type="number"
                className="w-12 rounded-md bg-white/10 border border-white/30 px-1 py-0.5 text-xs text-center text-white/90 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-emerald-400"
                min={0}
                max={item.max}
                value={item.value}
                onChange={(e) => item.set(Number(e.target.value))}
                disabled={!custom}
                placeholder={item.label}
              />
              {/* Floating label */}
              <span className="absolute -top-2 left-1 text-[10px] px-1 bg-black/50 text-emerald-300 rounded">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
