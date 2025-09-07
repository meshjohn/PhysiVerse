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

export default function DesktopPanel({
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
    <div className="hidden md:flex flex-col gap-4 bg-white/20 backdrop-blur-md opacity-70 rounded-2xl p-5 border border-white/30 shadow-lg max-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Atomic Structure</h2>
        <span className="text-xs opacity-80">Bohr-style</span>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wide opacity-80">
          Preset
        </label>
        <Listbox value={presetKey} onChange={onSelectPreset}>
          <ListboxButton
            className={clsx(
              "relative w-full rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1.5 pr-8 text-left text-sm text-white shadow-md",
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
      </div>

      {/* Toggle */}
      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          className="form-checkbox rounded accent-emerald-500"
          checked={custom}
          onChange={(e) => setCustom(e.target.checked)}
        />
        Custom counts
      </label>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Protons", value: protons, set: setProtons, max: 60 },
          { label: "Neutrons", value: neutrons, set: setNeutrons, max: 80 },
          { label: "Electrons", value: electrons, set: setElectrons, max: 40 },
        ].map((item, i) => (
          <div key={i} className="flex flex-col">
            <label className="text-xs opacity-80">{item.label}</label>
            <input
              type="number"
              className="w-full rounded-lg bg-white/10 border border-white/30 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              min={0}
              max={item.max}
              value={item.value}
              onChange={(e) => item.set(Number(e.target.value))}
              disabled={!custom}
            />
          </div>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs opacity-70 leading-relaxed">
        Shell capacities (2, 8, 18, 32...) are simplified. For learning only.
      </p>
    </div>
  );
}
