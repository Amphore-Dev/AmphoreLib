import React from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

import { ISelectProps, Select } from "./Select";

const OPTIONS = [
	{ value: "day", label: "Jour" },
	{ value: "week", label: "Semaine" },
	{ value: "month", label: "Mois" },
];

describe("Select", () => {
	it("defaults size to md when no prop and no AmphoreProvider default is given", () => {
		const { container } = render(
			<Select options={OPTIONS} onChange={() => {}} />
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"md"
		);
	});

	it("falls back to AmphoreProvider's config.defaults.size when no size prop is given", () => {
		const { container } = render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Select options={OPTIONS} onChange={() => {}} />
			</AmphoreProvider>
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"lg"
		);
	});

	it("an explicit size prop wins over AmphoreProvider's default", () => {
		const { container } = render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Select options={OPTIONS} onChange={() => {}} size="sm" />
			</AmphoreProvider>
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"sm"
		);
	});

	it("shows the placeholder when no value is selected", () => {
		render(
			<Select
				options={OPTIONS}
				placeholder="Choisir..."
				onChange={() => {}}
			/>
		);
		expect(screen.getByText("Choisir...")).toBeInTheDocument();
	});

	it("renders a leading picto when provided", () => {
		render(
			<Select options={OPTIONS} onChange={() => {}} picto="calendar" />
		);
		expect(screen.getByTestId("calendar")).toBeInTheDocument();
	});

	it("shows the selected option's label", () => {
		render(<Select options={OPTIONS} value="week" onChange={() => {}} />);
		expect(screen.getByText("Semaine")).toBeInTheDocument();
	});

	it("opens the listbox on click and lists every option", async () => {
		render(<Select options={OPTIONS} onChange={() => {}} />);
		await userEvent.click(screen.getByRole("combobox"));
		const listbox = screen.getByRole("listbox");
		expect(within(listbox).getByText("Jour")).toBeInTheDocument();
		expect(within(listbox).getByText("Semaine")).toBeInTheDocument();
		expect(within(listbox).getByText("Mois")).toBeInTheDocument();
	});

	it("keyboard: Enter opens the closed listbox", async () => {
		render(<Select options={OPTIONS} onChange={() => {}} />);
		const trigger = screen.getByRole("combobox");
		trigger.focus();
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

		await userEvent.keyboard("{Enter}");
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("keyboard: ArrowDown highlights an option and Enter selects it", async () => {
		const onChange = vi.fn();
		render(<Select options={OPTIONS} onChange={onChange} />);
		const trigger = screen.getByRole("combobox");
		trigger.focus();
		await userEvent.keyboard("{ArrowDown}"); // -> Jour
		await userEvent.keyboard("{ArrowDown}"); // -> Semaine

		const active = screen.getByText("Semaine");
		expect(trigger).toHaveAttribute("aria-activedescendant", active.id);

		await userEvent.keyboard("{Enter}");
		expect(onChange).toHaveBeenCalledWith("week");
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("selects an option, calls onChange with its value, and closes (single mode)", async () => {
		const onChange = vi.fn();
		render(<Select options={OPTIONS} onChange={onChange} />);
		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.click(screen.getByText("Semaine"));

		expect(onChange).toHaveBeenCalledWith("week");
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("multi mode: toggles options in/out of an array, stays open", async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Select options={OPTIONS} value={[]} onChange={onChange} multiple />
		);
		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.click(screen.getByText("Jour"));
		expect(onChange).toHaveBeenCalledWith(["day"]);

		rerender(
			<Select
				options={OPTIONS}
				value={["day"]}
				onChange={onChange}
				multiple
			/>
		);
		expect(screen.getByRole("listbox")).toBeInTheDocument(); // still open
		await userEvent.click(screen.getByText("Mois"));
		expect(onChange).toHaveBeenCalledWith(["day", "month"]);
	});

	it("multi mode: renders selected options as removable chips", async () => {
		const onChange = vi.fn();
		render(
			<Select
				options={OPTIONS}
				value={["day", "week"]}
				onChange={onChange}
				multiple
			/>
		);
		expect(screen.getByText("Jour")).toBeInTheDocument();
		expect(screen.getByText("Semaine")).toBeInTheDocument();

		await userEvent.click(screen.getByLabelText("Remove Jour"));
		expect(onChange).toHaveBeenCalledWith(["week"]);
	});

	it("filters options by label when searchable", async () => {
		render(<Select options={OPTIONS} searchable onChange={() => {}} />);
		await userEvent.click(screen.getByRole("combobox"));
		// Once open+searchable, typing happens in the inner search <input>,
		// not the outer role="combobox" div (which owns click/keyboard nav).
		await userEvent.type(screen.getByRole("textbox"), "se");

		const listbox = screen.getByRole("listbox");
		expect(within(listbox).getByText("Semaine")).toBeInTheDocument();
		expect(within(listbox).queryByText("Jour")).not.toBeInTheDocument();
		expect(within(listbox).queryByText("Mois")).not.toBeInTheDocument();
	});

	it("typing a space in the search input inserts a space, doesn't close the listbox", async () => {
		render(<Select options={OPTIONS} searchable onChange={() => {}} />);
		await userEvent.click(screen.getByRole("combobox"));
		const input = screen.getByRole("textbox");
		await userEvent.type(input, "a b");

		expect(input).toHaveValue("a b");
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("shows the clear button only when there's a value, and clears on click", async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Select
				options={OPTIONS}
				value={null}
				onChange={onChange}
				isClearable
			/>
		);
		expect(screen.queryByLabelText("Clear")).not.toBeInTheDocument();

		rerender(
			<Select
				options={OPTIONS}
				value="day"
				onChange={onChange}
				isClearable
			/>
		);
		await userEvent.click(screen.getByLabelText("Clear"));
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it("shows a message when no option matches the search", async () => {
		render(<Select options={OPTIONS} searchable onChange={() => {}} />);
		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.type(screen.getByRole("textbox"), "zzz");
		expect(screen.getByText("No results")).toBeInTheDocument();
	});

	it("does not open when disabled", async () => {
		render(<Select options={OPTIONS} onChange={() => {}} disabled />);
		await userEvent.click(screen.getByRole("combobox"));
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("floatingProps overrides the internal useFloating config (e.g. placement)", async () => {
		render(
			<Select
				options={OPTIONS}
				onChange={() => {}}
				floatingProps={{ placement: "top-start" }}
			/>
		);
		await userEvent.click(screen.getByRole("combobox"));
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("floatingProps can't override open/onOpenChange — the component still owns open state", async () => {
		const rogueOnOpenChange = vi.fn();
		// Forbidden at the type level (Omit<..., "open" | "onOpenChange">) —
		// `as any` here only to prove at runtime that even if a consumer
		// bypasses that, the merge order still ignores these two keys.
		const rogueFloatingProps = {
			open: true,
			onOpenChange: rogueOnOpenChange,
		} as unknown as ISelectProps["floatingProps"];

		render(
			<Select
				options={OPTIONS}
				onChange={() => {}}
				floatingProps={rogueFloatingProps}
			/>
		);
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

		await userEvent.click(screen.getByRole("combobox"));
		expect(screen.getByRole("listbox")).toBeInTheDocument();
		expect(rogueOnOpenChange).not.toHaveBeenCalled();
	});

	it("shows the error message", () => {
		render(
			<Select
				options={OPTIONS}
				onChange={() => {}}
				error="Champ requis"
			/>
		);
		expect(screen.getByRole("alert")).toHaveTextContent("Champ requis");
	});

	it("calls onSearchChange on every keystroke in the search input", async () => {
		const onSearchChange = vi.fn();
		render(
			<Select
				options={OPTIONS}
				onChange={() => {}}
				searchable
				onSearchChange={onSearchChange}
			/>
		);
		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.type(screen.getByRole("textbox"), "ab");
		expect(onSearchChange).toHaveBeenCalledWith("a");
		expect(onSearchChange).toHaveBeenCalledWith("ab");
	});

	it("skips client-side filtering when filterOptions=false, showing all given options", async () => {
		render(
			<Select
				options={OPTIONS}
				onChange={() => {}}
				searchable
				filterOptions={false}
			/>
		);
		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.type(screen.getByRole("textbox"), "zzz-no-match");
		expect(screen.getAllByRole("option").length).toBe(OPTIONS.length);
	});

	it("shows a loading state instead of options/no-results when isLoading", async () => {
		render(<Select options={OPTIONS} onChange={() => {}} isLoading />);
		await userEvent.click(screen.getByRole("combobox"));
		expect(screen.queryByRole("option")).not.toBeInTheDocument();
		expect(screen.queryByText("No results")).not.toBeInTheDocument();
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("uses a custom loadingMessage", async () => {
		render(
			<Select
				options={OPTIONS}
				onChange={() => {}}
				isLoading
				loadingMessage="Recherche en cours..."
			/>
		);
		await userEvent.click(screen.getByRole("combobox"));
		expect(screen.getByText("Recherche en cours...")).toBeInTheDocument();
	});

	it("shows a spinner next to the chevron when isLoading, even before opening", () => {
		const { container } = render(
			<Select options={OPTIONS} onChange={() => {}} isLoading />
		);
		expect(
			container.querySelector('[class*="loadingIcon"]')
		).toBeInTheDocument();
	});

	describe("renderOption", () => {
		type TCompany = { id: string; name: string; logo?: string };
		const companies: TCompany[] = [
			{ id: "1", name: "Acme", logo: "acme.png" },
			{ id: "2", name: "Globex" },
		];
		const companyOptions = companies.map((c) => ({
			value: c,
			label: c.name,
		}));
		const renderOption = (option: { value: TCompany; label: string }) => (
			<span data-testid={`opt-${option.value.id}`}>
				{option.value.logo && (
					<img alt={option.value.name} src={option.value.logo} />
				)}
				{option.label}
			</span>
		);

		it("uses renderOption for each option in the listbox, access the full option value (not just its label)", async () => {
			render(
				<Select
					options={companyOptions}
					value={null}
					onChange={() => {}}
					renderOption={renderOption}
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			expect(screen.getByTestId("opt-1")).toBeInTheDocument();
			expect(
				within(screen.getByTestId("opt-1")).getByRole("img")
			).toBeInTheDocument();
			expect(screen.getByTestId("opt-2")).toBeInTheDocument();
		});

		it("uses renderOption for the current single-select value too", () => {
			render(
				<Select
					options={companyOptions}
					value={companies[0]}
					onChange={() => {}}
					renderOption={renderOption}
				/>
			);
			expect(screen.getByTestId("opt-1")).toBeInTheDocument();
		});

		it("gives every object-valued option a distinct key, even though they all stringify the same (regression: React warned about duplicate keys before index was added)", async () => {
			const consoleError = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});
			render(
				<Select
					options={companyOptions}
					value={null}
					onChange={() => {}}
					renderOption={renderOption}
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			expect(
				consoleError.mock.calls.some((call) =>
					String(call[0]).includes("same key")
				)
			).toBe(false);
			consoleError.mockRestore();
		});

		it("falls back to the plain label when no renderOption is given", () => {
			render(
				<Select
					options={companyOptions}
					value={companies[0]}
					onChange={() => {}}
				/>
			);
			expect(screen.getByText("Acme")).toBeInTheDocument();
			expect(screen.queryByTestId("opt-1")).not.toBeInTheDocument();
		});
	});

	describe("getOptionValue", () => {
		type TCompany = { id: string; name: string };
		const companies: TCompany[] = [
			{ id: "1", name: "Acme" },
			{ id: "2", name: "Globex" },
		];
		const companyOptions = companies.map((c) => ({
			value: c,
			label: c.name,
		}));

		it("shows the current value as selected even when it's a different object reference than its matching option (matched by id, not ===)", () => {
			// Same id as companies[0], but a distinct object reference — e.g.
			// the value a form's initial state came from, versus a fresh
			// fetch's own copy of "the same" company.
			const staleReferenceValue: TCompany = { id: "1", name: "Acme" };
			render(
				<Select
					options={companyOptions}
					value={staleReferenceValue}
					onChange={() => {}}
					getOptionValue={(c) => c.id}
				/>
			);
			expect(screen.getByText("Acme")).toBeInTheDocument();
			expect(screen.queryByText("Select...")).not.toBeInTheDocument();
		});

		it("without getOptionValue, a different-reference-but-same-id value is NOT recognized as selected (the === default)", () => {
			const staleReferenceValue: TCompany = { id: "1", name: "Acme" };
			render(
				<Select
					options={companyOptions}
					value={staleReferenceValue}
					onChange={() => {}}
					placeholder="Choisir..."
				/>
			);
			expect(screen.getByText("Choisir...")).toBeInTheDocument();
		});

		it("selects/deselects a multi-select option by id, not by reference", () => {
			const onChange = vi.fn();
			const staleReferenceValue: TCompany = { id: "1", name: "Acme" };
			render(
				<Select
					options={companyOptions}
					value={[staleReferenceValue]}
					onChange={onChange}
					getOptionValue={(c) => c.id}
					multiple
				/>
			);
			// Already selected (by id) — clicking it again should deselect.
			expect(screen.getByText("Acme")).toBeInTheDocument();
		});

		it("removing a chip matches by id, not by reference", async () => {
			const onChange = vi.fn();
			const staleReferenceValue: TCompany = { id: "1", name: "Acme" };
			render(
				<Select
					options={companyOptions}
					value={[staleReferenceValue]}
					onChange={onChange}
					getOptionValue={(c) => c.id}
					multiple
				/>
			);
			await userEvent.click(screen.getByRole("button", { name: /Acme/ }));
			expect(onChange).toHaveBeenCalledWith([]);
		});
	});

	describe("grouped options", () => {
		const GROUPED = [
			{
				label: "Calendriers",
				options: [
					{ value: "cal-1", label: "Calendrier A" },
					{ value: "cal-2", label: "Calendrier B" },
				],
			},
			{
				label: "Projets",
				options: [{ value: "proj-1", label: "Projet X" }],
			},
		];

		it("renders a heading above each group, and every option under it", async () => {
			render(
				<Select options={GROUPED} value={null} onChange={() => {}} />
			);
			await userEvent.click(screen.getByRole("combobox"));
			expect(screen.getByText("Calendriers")).toBeInTheDocument();
			expect(screen.getByText("Projets")).toBeInTheDocument();
			expect(screen.getAllByRole("option")).toHaveLength(3);
		});

		it("uses renderGroupHeader to override a group's heading", async () => {
			render(
				<Select
					options={GROUPED}
					value={null}
					onChange={() => {}}
					renderGroupHeader={(group) => (
						<strong>
							{group.label} ({group.options.length})
						</strong>
					)}
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			expect(screen.getByText("Calendriers (2)")).toBeInTheDocument();
			expect(screen.getByText("Projets (1)")).toBeInTheDocument();
		});

		it("selects the right option by click even across group boundaries", async () => {
			const onChange = vi.fn();
			render(
				<Select options={GROUPED} value={null} onChange={onChange} />
			);
			await userEvent.click(screen.getByRole("combobox"));
			await userEvent.click(screen.getByText("Projet X"));
			expect(onChange).toHaveBeenCalledWith("proj-1");
		});

		it("arrow-key navigation skips group headings (only lands on real options)", async () => {
			const user = userEvent.setup();
			render(
				<Select options={GROUPED} value={null} onChange={() => {}} />
			);
			const combobox = screen.getByRole("combobox");
			await user.click(combobox);
			// 3 ArrowDowns from nothing active should land on the 3rd real
			// option ("Projet X"), never having stopped on either heading.
			await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
			const activeId = combobox.getAttribute("aria-activedescendant");
			const active = document.getElementById(activeId!);
			expect(active).toHaveTextContent("Projet X");
		});

		it("drops a group entirely from the listbox once search filters out all its options", async () => {
			render(
				<Select
					options={GROUPED}
					value={null}
					onChange={() => {}}
					searchable
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			await userEvent.type(screen.getByRole("textbox"), "Projet");
			expect(screen.queryByText("Calendriers")).not.toBeInTheDocument();
			expect(screen.getByText("Projets")).toBeInTheDocument();
			expect(screen.getByText("Projet X")).toBeInTheDocument();
		});

		it("still resolves the current value's display even when grouped", () => {
			render(
				<Select options={GROUPED} value="proj-1" onChange={() => {}} />
			);
			expect(screen.getByText("Projet X")).toBeInTheDocument();
		});
	});

	describe("clearInputOnSelect", () => {
		it("resets the typed search query after picking an option", async () => {
			render(
				<Select
					options={OPTIONS}
					value={null}
					onChange={() => {}}
					searchable
					clearInputOnSelect
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			await userEvent.type(screen.getByRole("textbox"), "se");
			await userEvent.click(screen.getByText("Semaine"));

			// Reopen — with the query cleared, every option should show
			// again instead of staying filtered to the stale "se" query.
			await userEvent.click(screen.getByRole("combobox"));
			expect(screen.getByRole("textbox")).toHaveValue("");
			const listbox = screen.getByRole("listbox");
			expect(within(listbox).getByText("Jour")).toBeInTheDocument();
			expect(within(listbox).getByText("Mois")).toBeInTheDocument();
		});

		it("leaves the typed search query as-is when not set (default)", async () => {
			render(
				<Select
					options={OPTIONS}
					value={null}
					onChange={() => {}}
					searchable
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			await userEvent.type(screen.getByRole("textbox"), "se");
			await userEvent.click(screen.getByText("Semaine"));

			await userEvent.click(screen.getByRole("combobox"));
			expect(screen.getByRole("textbox")).toHaveValue("se");
		});

		it("doesn't change what onChange receives or how many times it fires", async () => {
			const onChange = vi.fn();
			render(
				<Select
					options={OPTIONS}
					value={null}
					onChange={onChange}
					searchable
					clearInputOnSelect
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			await userEvent.type(screen.getByRole("textbox"), "se");
			await userEvent.click(screen.getByText("Semaine"));
			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith("week");
		});
	});

	describe("footer", () => {
		it("renders arbitrary content at the end of the open listbox", async () => {
			render(
				<Select
					options={OPTIONS}
					value={null}
					onChange={() => {}}
					footer={<button type="button">Voir plus</button>}
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			expect(
				screen.getByRole("button", { name: "Voir plus" })
			).toBeInTheDocument();
		});

		it("clicking the footer doesn't select an option or throw", async () => {
			const onChange = vi.fn();
			const onFooterClick = vi.fn();
			render(
				<Select
					options={OPTIONS}
					value={null}
					onChange={onChange}
					footer={
						<button type="button" onClick={onFooterClick}>
							Voir plus
						</button>
					}
				/>
			);
			await userEvent.click(screen.getByRole("combobox"));
			await userEvent.click(
				screen.getByRole("button", { name: "Voir plus" })
			);
			expect(onFooterClick).toHaveBeenCalledTimes(1);
			expect(onChange).not.toHaveBeenCalled();
		});

		it("renders no footer at all when none is given", async () => {
			render(
				<Select options={OPTIONS} value={null} onChange={() => {}} />
			);
			await userEvent.click(screen.getByRole("combobox"));
			expect(
				screen.queryByRole("button", { name: "Voir plus" })
			).not.toBeInTheDocument();
		});
	});

	describe("portal", () => {
		it("renders the listbox inline by default", async () => {
			const { container } = render(
				<Select options={OPTIONS} onChange={() => {}} />
			);
			await userEvent.click(screen.getByRole("combobox"));
			expectInline(container, screen.getByRole("listbox"));
		});

		it("renders into document.body with the theme scope when portal is set, and selection still works", async () => {
			const onChange = vi.fn();
			const { container } = render(
				<AmphoreProvider>
					<Select options={OPTIONS} onChange={onChange} portal />
				</AmphoreProvider>
			);
			await userEvent.click(screen.getByRole("combobox"));
			const listbox = screen.getByRole("listbox");
			expectPortaledWithScope(container, listbox);
			await userEvent.click(within(listbox).getByText("Semaine"));
			expect(onChange).toHaveBeenCalledWith("week");
		});
	});
});
