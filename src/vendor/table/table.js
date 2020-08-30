			var sort = 1;
			function sortTable(n, s) {
				  var rel = typeof n === 'undefined';
				  var rel1 = typeof s === 'undefined';

				  if(rel1){
					s = true;
				  }
				  
				  if(rel){
					n = sort;
				  }
					
				  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
				  table = document.getElementById('table');
				  switching = true;
				  // Set the sorting direction to ascending:
				  dir = "desc";
				  /* Make a loop that will continue until
				  no switching has been done: */
				  while (switching) {
				    // Start by saying: no switching is done:
				    switching = false;
				    rows = table.rows;
				    /* Loop through all table rows (except the
				    first, which contains table headers): */
				    for (i = 1; i < (rows.length - 1); i++) {
				      // Start by saying there should be no switching:
				      shouldSwitch = false;
				      /* Get the two elements you want to compare,
				      one from current row and one from the next: */
				      x = rows[i].getElementsByTagName("TD")[n];
				      y = rows[i + 1].getElementsByTagName("TD")[n];
				      /* Check if the two rows should switch place,
				      based on the direction, asc or desc: */
				      if (dir == "asc") {
				        if (parseInt(x.innerHTML.toLowerCase()) > parseInt(y.innerHTML.toLowerCase())) {
				          // If so, mark as a switch and break the loop:
				          shouldSwitch = true;
				          break;
				        }
				      } else if (dir == "desc") {
				        if (parseInt(x.innerHTML.toLowerCase()) < parseInt(y.innerHTML.toLowerCase())) {
				          // If so, mark as a switch and break the loop:
				          shouldSwitch = true;
				          break;
				        }
				      }
				    }
				    if (shouldSwitch) {
				      /* If a switch has been marked, make the switch
				      and mark that a switch has been done: */
				      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				      switching = true;
				      // Each time a switch is done, increase this count by 1:
				      switchcount++;
				    } else {
					      /* If no switching has been done AND the direction is "asc",
					      set the direction to "desc" and run the while loop again. */
					      if (s && switchcount == 0 && dir == "desc") {
					        dir = "asc";
					        switching = true;
					      }
					    }
				  }
				}
			
			function updateRow(stats, el){
				var wins = getStat(stats.stats,"wins");
				var loses = getStat(stats.stats,"loses");
				
				if(el.childNodes[1].innerHTML!=wins.toString()){
					explodeElement(el.childNodes[1]);
					el.childNodes[1].innerHTML=wins;
				}
				if(el.childNodes[2].innerHTML!=loses.toString()){
					explodeElement(el.childNodes[2]);
					el.childNodes[2].innerHTML=loses;
				}
			}
			
			function getStat(stats, key){
				for (var i = 0; i < stats.length; i++) {
					if(stats[i].key == key)return stats[i].value;
				}
				return "not found";
			}

			function createRow(stats){
				var tr = document.createElement('tr');
				tr.id=stats.uuid;
				
				var td = document.createElement('td');
				td.innerHTML=stats.name;
				tr.appendChild(td);

				td = td.cloneNode(false);
				td.innerHTML=getStat(stats.stats,'wins');
				tr.appendChild(td);

				td = td.cloneNode(false);
				td.innerHTML=getStat(stats.stats,'loses');
				tr.appendChild(td);

				return tr;
			}