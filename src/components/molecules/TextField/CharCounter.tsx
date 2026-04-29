import React from "react";

interface ICharCounterProps {
	maxLength?: number;
	length?: number;
	className?: string;
}

const CharCounter: React.FC<ICharCounterProps> = ({
	maxLength,
	length,
	className,
}) => {
	if (maxLength) {
		return (
			<span className={className}>
				{length || 0}/{maxLength}
			</span>
		);
	}
	return null;
};

export default CharCounter;
