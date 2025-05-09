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
				const response = await fetch('https://api.ticketexpert.me/api/events');
				if (!response.ok) {
					throw new Error('Failed to fetch events');
				}
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

	const mainCategories = {
		'Entertainment': {
			description: 'Discover concerts, festivals, and live performances',
			categories: ['Music', 'Entertainment', 'Festival', 'Concert', 'Show']
		},
		'Sports': {
			description: 'Experience sports events and outdoor activities',
			categories: ['Sports', 'Recreation', 'Fitness', 'Game', 'Tournament']
		},
		'Arts': {
			description: 'Explore exhibitions, museums, and cultural events',
			categories: ['Arts', 'Culture', 'Exhibition', 'Museum', 'Gallery']
		},
		'Business': {
			description: 'Attend conferences, workshops, and seminars',
			categories: ['Business', 'Education', 'Conference', 'Workshop', 'Seminar']
		}
	};

	const getTopEventsForCategory = (categories) => {
		const matchingEvents = events.filter(event => {
			const eventCategory = event.category?.toLowerCase() || '';
			const eventTags = event.tags?.map(tag => tag.toLowerCase()) || [];
			
			return categories.some(cat => {
				const categoryLower = cat.toLowerCase();
				return eventCategory.includes(categoryLower) || 
					   eventTags.some(tag => tag.includes(categoryLower));
			});
		});

		return matchingEvents
			.sort((a, b) => new Date(a.fromDateTime) - new Date(b.fromDateTime))
			.slice(0, 2);
	};

	const formatDate = (dateString) => {
		if (!dateString) return '';
		try {
			return new Date(dateString).toLocaleDateString('en-AU', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch (error) {
			console.error('Error formatting date:', error);
			return '';
		}
	};

	if (loading) {
		return (
			<div className="NavigationMenuRoot" style={{ padding: '1rem', textAlign: 'center' }}>
				Loading...
			</div>
		);
	}

	return (
		<NavigationMenu.Root className="NavigationMenuRoot">
			<NavigationMenu.List className="NavigationMenuList">
				{Object.entries(mainCategories).map(([category, { description, categories }]) => {
					const categoryEvents = getTopEventsForCategory(categories);
					
					return (
						<NavigationMenu.Item key={category}>
							<NavigationMenu.Trigger className="NavigationMenuTrigger">
								{category} <CaretDownIcon className="CaretDown" aria-hidden />
							</NavigationMenu.Trigger>
							<NavigationMenu.Content className="NavigationMenuContent">
								<ul className="List one">
									<li style={{ gridRow: "span 2" }}>
										<NavigationMenu.Link asChild>
											<a className="Callout" href={`/events?category=${category}`}>
												<div className="CalloutHeading">{category}</div>
												<p className="CalloutText">{description}</p>
											</a>
										</NavigationMenu.Link>
									</li>

									{categoryEvents.length > 0 ? (
										categoryEvents.map(event => (
											<ListItem 
												key={event.eventId}
												href={`/event/${event.eventId}`}
												title={event.title}
											>
												<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
													<span style={{ color: '#666', fontSize: '0.9rem' }}>
														{formatDate(event.fromDateTime)}
													</span>
													<span style={{ color: '#444' }}>
														{event.description.length > 100 
															? `${event.description.substring(0, 100)}...` 
															: event.description}
													</span>
													<span style={{ 
														color: '#166534', 
														fontSize: '0.9rem', 
														fontWeight: 500 
													}}>
														{event.venue}, {event.region}
													</span>
												</div>
											</ListItem>
										))
									) : (
										<ListItem 
											href={`/events?category=${category}`}
											title="No events found"
										>
											<div style={{ color: '#666' }}>
												Check back soon for new events in this category
											</div>
										</ListItem>
									)}
								</ul>
							</NavigationMenu.Content>
						</NavigationMenu.Item>
					);
				})}

				<NavigationMenu.Item>
					<NavigationMenu.Link
						className="NavigationMenuLink"
						href="/events"
					>
						All Events
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
					<div className="ListItemText">{children}</div>
				</a>
			</NavigationMenu.Link>
		</li>
	),
);

export default NavigationMenuDemo;