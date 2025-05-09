import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import "./styles.css";

const NavigationMenuDemo = () => {
	const [events, setEvents] = React.useState([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch('https://www.api.ticketexpert.me/api/events');
				const data = await response.json();
				setEvents(data);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	// Group events by type
	const eventsByType = React.useMemo(() => {
		return events.reduce((acc, event) => {
			if (!acc[event.type]) {
				acc[event.type] = [];
			}
			acc[event.type].push(event);
			return acc;
		}, {});
	}, [events]);

	// Define main categories and their corresponding event types
	const mainCategories = {
		Conferneces: ['conference', 'workshop'],
		Entertainment: ['festival', 'show'],
		Family: ['exhibition', 'workshop']
	};

	// Get top 3 events for each category
	const getTopEventsForCategory = (types) => {
		const categoryEvents = types.flatMap(type => eventsByType[type] || []);
		return categoryEvents.slice(0, 3);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<NavigationMenu.Root className="NavigationMenuRoot">
			<NavigationMenu.List className="NavigationMenuList">
				{Object.entries(mainCategories).map(([category, types]) => (
					<NavigationMenu.Item key={category}>
						<NavigationMenu.Trigger className="NavigationMenuTrigger">
							{category} <CaretDownIcon className="CaretDown" aria-hidden />
						</NavigationMenu.Trigger>
						<NavigationMenu.Content className="NavigationMenuContent">
							<ul className="List one">
								<li style={{ gridRow: "span 3" }}>
									<NavigationMenu.Link asChild>
										<a className="Callout" href="/">
											<div className="CalloutHeading">{category}</div>
											<p className="CalloutText">
												{`Discover the best ${category.toLowerCase()} events and experiences`}
											</p>
										</a>
									</NavigationMenu.Link>
								</li>

								{getTopEventsForCategory(types).map(event => (
									<ListItem 
										key={event.eventId}
										href={`/event/${event.eventId}`}
										title={event.title}
									>
										{event.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
				))}

				<NavigationMenu.Item>
					<NavigationMenu.Link
						className="NavigationMenuLink"
						href="/events"
					>
						Show All
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Indicator className="NavigationMenuIndicator">
					<div className="Arrow" />
				</NavigationMenu.Indicator>
			</NavigationMenu.List>

			<div className="ViewportPosition">
				<NavigationMenu.Viewport className="NavigationMenuViewport" />
			</div>
		</NavigationMenu.Root>
	);
};

const ListItem = React.forwardRef(
	({ className, children, title, ...props }, forwardedRef) => (
		<li>
			<NavigationMenu.Link asChild>
				<a
					className={classNames("ListItemLink", className)}
					{...props}
					ref={forwardedRef}
				>
					<div className="ListItemHeading">{title}</div>
					<p className="ListItemText">{children}</p>
				</a>
			</NavigationMenu.Link>
		</li>
	),
);

export default NavigationMenuDemo;