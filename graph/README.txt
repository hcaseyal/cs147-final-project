This visualization allows filtering by circle intersection and species.

When the visualization starts up, you should see two green circles on the map
among a bunch of blue circles, which represent the tree locations. If you want to 
filter by circle intersection, click the checkbox. Then, you can drag the 
green circles to specify a point of interest and resize the green circles by dragging 
their borders. There are text labels that will show you your current points of interest
latitude and longitude as well as the radiuses in miles. 

The drop down menu in the upper left lets you filter by species. By default, all species are shown. 

The slider in the upper right lets you filter by diameter.

Order doesn't matter in filtering, and you can filter in any combination. 


////////////

Development process

////////////

I'm completely new to D3 and not too familiar with javascript and such, so I frequently
got tripped up on type conversion errors (e.g., didn't convert a string to a number). 
I really got tripped up on the "d3.event.x" thing and ended up using "event.x". According 
to a stack overflow site, d3.event.x only works properly when you have elements inside a 
"g" element inside an svg, not when the elements are appended directly to the svg. However, I tried this and d3.event.x was still returning the incorrect value, so I gave up
and used event.x instead. 

I feel like I got blocked by a lot of little things that stemmed from me not being comfortable with javascript/HTML/CSS/d3. Thus, this assignment took me a lot more time
than anticipated ( ~10 hours or more).

The in-class work time and tutorials were super helpful. I think I would have had a lot more trouble with this assignment without these sessions. 