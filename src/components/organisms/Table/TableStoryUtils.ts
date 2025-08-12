export const CStoryUsersFirstNames = [
	"John",
	"Jane",
	"Sam",
	"Alice",
	"Michael",
	"Emily",
	"David",
	"Sarah",
	"Chris",
	"Jessica",
	"Daniel",
	"Laura",
	"Matthew",
	"Sophia",
	"Andrew",
	"Olivia",
	"James",
	"Emma",
	"William",
	"Ava",
];
export const CStoryUsersLastNames = [
	"Doe",
	"Smith",
	"Wilson",
	"Johnson",
	"Brown",
	"Davis",
	"Miller",
	"Garcia",
	"Martinez",
	"Hernandez",
	"Lopez",
	"Gonzalez",
	"Perez",
	"Robinson",
	"Clark",
	"Rodriguez",
	"Lewis",
];
export const CStoryUsersOccupations = [
	"Software Engineer",
	"Designer",
	"Product Manager",
	"Data Scientist",
	"Web Developer",
	"Marketing Specialist",
	"Sales Associate",
	"Project Coordinator",
	"Business Analyst",
	"UX Researcher",
	"Graphic Designer",
	"Content Writer",
	"SEO Specialist",
	"Social Media Manager",
	"Network Administrator",
	"Database Administrator",
	"Cybersecurity Analyst",
	"Cloud Engineer",
	"DevOps Engineer",
	"Mobile App Developer",
	"Data Analyst",
	"IT Support Specialist",
	"System Administrator",
	"Technical Writer",
];

export const CStoryUsersCountries = [
	"USA",
	"Canada",
	"UK",
	"Australia",
	"Germany",
	"France",
	"Italy",
	"Spain",
	"Netherlands",
	"Sweden",
	"Norway",
	"Finland",
	"Denmark",
	"Iceland",
	"Belgium",
	"Switzerland",
	"Austrian",
];

export const CStoryUsersCities = [
	"New York",
	"Los Angeles",
	"Chicago",
	"Houston",
	"Phoenix",
	"Philadelphia",
	"San Antonio",
	"San Diego",
	"Dallas",
	"San Jose",
	"Toronto",
	"Vancouver",
	"Montreal",
	"Calgary",
	"Ottawa",
	"Edmonton",
];

export const genUsersDataSet = (count: number) => {
	const dataSet = [];
	for (let i = 0; i < count; i++) {
		let name =
			CStoryUsersFirstNames[
				Math.floor(Math.random() * CStoryUsersFirstNames.length)
			] +
			" " +
			CStoryUsersLastNames[
				Math.floor(Math.random() * CStoryUsersLastNames.length)
			];
		const hasSecondName = Math.random() < 0.6;
		if (hasSecondName) {
			name +=
				" " +
				CStoryUsersLastNames[
					Math.floor(Math.random() * CStoryUsersLastNames.length)
				];
		}
		const age = Math.floor(Math.random() * 60) + 16;
		const country =
			CStoryUsersCountries[
				Math.floor(Math.random() * CStoryUsersCountries.length)
			];
		const city =
			CStoryUsersCities[
				Math.floor(Math.random() * CStoryUsersCities.length)
			];
		const occupation =
			CStoryUsersOccupations[
				Math.floor(Math.random() * CStoryUsersOccupations.length)
			];
		const isNew = Math.random() < 0.5;
		const hasPhone = Math.random() < 0.5;
		const hasEmail = Math.random() < 0.5;

		const isOut = !isNew && Math.random() < 0.5;

		const email = hasEmail
			? `${name.replace(/\s/g, ".").toLowerCase()}@example.com`
			: undefined;
		const phone = hasPhone
			? `06${Math.floor(Math.random() * 10000000)}`
			: undefined;
		dataSet.push({
			id: i,
			name,
			age,
			country,
			city,
			occupation,
			isNew,
			email,
			phone,
			isOut,
		});
	}
	return dataSet;
};
