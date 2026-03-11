---
# layout: '#layout/Publication.astro'
---

# Test Task for Iagon Media ([frontend position](https://iagon.media/join-the-team)).

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
	
	:root {
		color: white;
		background-color: black;
		font-family: "Inter", sans-serif;
		font-optical-sizing: auto;
		font-weight: 400;
		font-style: normal;
		
		padding: 3rem;
		* {
			box-sizing: border-box;
		}
		
		a {
			color: white;
			text-decoration-line: underline;
			text-decoration-skip-ink: none;
			text-decoration-thickness: 1px;
			text-underline-offset: 0.1em;
		}
	}
	.wrapper {
  
		background: url('/reference.png') no-repeat;
		background-color: black;
		/*background-position: 2rem 2rem;gc*/
		inline-size: 798px;
		block-size: 374px;
		
		margin-block-start: 3rem;
	}
	.test-task {
		mix-blend-mode: difference;
		
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: min-content min-content;
		place-content: stretch;
		place-items: stretch;
		
		color: white;
		background: rgb(6 9 15);
		
		border-radius: 32px;
		box-shadow: inset 0 0 0 1px rgb(88 90 94);
		
		nav {
			display: flex;
			place-content: center end;
			
			ul {
				list-style: none;
				padding: 0;
				margin: 0;
				display: flex;
				place-content: stretch;
				padding-inline: 40px;
				block-size: 90px;
				gap: 24px;
				
				li {
					margin: 0;
					padding: 0;
					display: flex;
					
					
					a {
						text-decoration: none;
						color: white;
						font-size: 16px;
						font-weight: 450;
						position: relative;
						padding-inline: 14px;
						padding-block: 36px;
						border: none !important;
						place-self: stretch;
						
						&:hover {
							color: white;
						}
						
						&:after {
							content: ' ';
							background: url('data:image/svg+xml,<svg width="104" height="14" viewBox="0 0 104 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M53 14L104 14.0001C73 14.0001 73.5 0 52 0C30.5 0 31 14 0 14H53Z" fill="%23E6EBF5"/></svg>') no-repeat center;
							position: absolute;
							inset-block-end: 0;
							inset-inline-start: 0;
							inset-inline-end: 0;
							
						}
						
						&.current {
							color: #2B75ED;
							&:after {
								block-size: 14px;
							}
						}
						&:not(.current) {
							color: #676D7E;
							&:after {
								block-size: 0px;
							}
						}
					}
				}
			}
		}
		.content {
			background: #E6EBF5;
			color: black;
			border: solid 0;
			border-start-start-radius: 40px;
			border-start-end-radius: 40px;
			margin: 0;
			padding: 40px;
		}
	}
</style>

<div class="wrapper">
	<section class="test-task">
		<nav><ul><li><a href="#" class="current">MenuItem</a><li><a href="#">MenuItem</a></ul></nav>
		<div class="content">
			Content
		</div>
	</section>
</div>
