import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PasswordField } from "./PasswordField";

// input -> Input's .field div -> Input's .wrapper div -> PasswordField's
// own outer div (where the mouseenter/mouseleave pair actually lives).
const getFieldWrapper = (input: HTMLElement) =>
	input.parentElement!.parentElement!.parentElement!;

describe("PasswordField", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders a password input by default", () => {
		render(
			<PasswordField value="" onChange={() => {}} label="Password" />
		);
		expect(screen.getByLabelText("Password")).toHaveAttribute(
			"type",
			"password"
		);
	});

	it("toggles to a text input when the toggle button is clicked", () => {
		render(
			<PasswordField
				value="secret"
				onChange={() => {}}
				label="Password"
			/>
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Show password" })
		);
		expect(screen.getByLabelText("Password")).toHaveAttribute(
			"type",
			"text"
		);
	});

	it("toggles back to password on a second click", () => {
		render(
			<PasswordField
				value="secret"
				onChange={() => {}}
				label="Password"
			/>
		);
		const toggle = () =>
			screen.getByRole("button", { name: /password/i });
		fireEvent.click(toggle());
		fireEvent.click(toggle());
		expect(screen.getByLabelText("Password")).toHaveAttribute(
			"type",
			"password"
		);
	});

	it("auto-hides after autoHideSeconds once the pointer leaves and it's not focused", () => {
		render(
			<PasswordField
				value="secret"
				onChange={() => {}}
				label="Password"
				autoHideSeconds={3}
			/>
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Show password" })
		);
		const input = screen.getByLabelText("Password");
		expect(input).toHaveAttribute("type", "text");

		fireEvent.mouseLeave(getFieldWrapper(input));
		act(() => vi.advanceTimersByTime(1000));
		act(() => vi.advanceTimersByTime(1000));
		act(() => vi.advanceTimersByTime(1000));

		expect(input).toHaveAttribute("type", "password");
	});

	it("cancels auto-hide when the pointer re-enters before it fires", () => {
		render(
			<PasswordField
				value="secret"
				onChange={() => {}}
				label="Password"
				autoHideSeconds={3}
			/>
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Show password" })
		);
		const input = screen.getByLabelText("Password");
		const wrapper = getFieldWrapper(input);
		fireEvent.mouseLeave(wrapper);
		act(() => vi.advanceTimersByTime(1500));
		fireEvent.mouseEnter(wrapper);
		act(() => vi.advanceTimersByTime(3000));

		expect(input).toHaveAttribute("type", "text");
	});

	it("doesn't auto-hide when autoHide=false", () => {
		render(
			<PasswordField
				value="secret"
				onChange={() => {}}
				label="Password"
				autoHide={false}
			/>
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Show password" })
		);
		const input = screen.getByLabelText("Password");
		fireEvent.mouseLeave(getFieldWrapper(input));
		act(() => vi.advanceTimersByTime(10000));

		expect(input).toHaveAttribute("type", "text");
	});

	it("still calls a consumer-provided onFocus/onBlur", () => {
		const onFocus = vi.fn();
		const onBlur = vi.fn();
		render(
			<PasswordField
				value=""
				onChange={() => {}}
				label="Password"
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		);
		const input = screen.getByLabelText("Password");
		fireEvent.focus(input);
		fireEvent.blur(input);
		expect(onFocus).toHaveBeenCalledTimes(1);
		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});
