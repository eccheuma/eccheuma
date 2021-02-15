<template>
	<!-- Пост -->
	<section @keydown.ctrl.enter="SendComment" :id="`PostID-${ payload.ID }`" :style="`order:${ PostOrder }`" class="post_container">
		
		<div class="container">

			<section class="post_header row py-4 px-3" :style="`background-image: url(${ ImageURL })`" ref="ImageHolder">

				<div class="col-12 text-center">
					<span class="post_header-tags py-1 px-5">{{ payload.tags }}</span>
				</div>

				<div class="col-12 text-lg-left text-center my-4">
					<div class="post_header-title py-5 px-3">
						<h4>{{ payload.title }}</h4>
						<h6>{{ payload.description }}</h6>
					</div>
				</div>

				<div class="col-12 text-center">
					<span class="post_header-time py-1 px-3">{{ payload.time }}</span>
				</div>

			</section>

			<section class="post_footer row p-lg-4 py-4">

				<div class="col-lg-3 col-12 px-0 order-lg-1 order-2 text-lg-left text-center mb-lg-0 mb-3">
					<div class="post_footer-social">

						<button @click="SetLike" :id="`LikePopOver-${ payload.ID }`"
							:class="[{ liked: UserLiked }, { NonActive: !this.LoginStatus }]">
							<i class="fas fa-fire">
								<transition name="Fade">
									<template v-if="Likes">
										<span class="post_btn_counter pl-2">{{ Object.keys(Likes).length }}</span>
									</template>
								</transition>
							</i>
						</button>

						<b-popover :container="`PostID-${ payload.ID }`" :target="`LikePopOver-${ payload.ID }`" triggers="hover"
							:delay="{ show: 0, hide: 150 }" placement="top">
							Оценить запись.
						</b-popover>

						<button @click='CommentSection = !CommentSection' :id="`CommentPopOver-${ payload.ID }`" 
							:class="{ clicked: CommentSection }">
							<i class="fas fa-comment">
								<template v-if="Comments">
									<span class="post_btn_counter pl-2">{{ Object.keys(Comments).length }}</span>
								</template>
							</i>
						</button>

						<b-popover :container="`PostID-${ payload.ID }`" :target="`CommentPopOver-${ payload.ID }`" triggers="hover"
							:delay="{ show: 0, hide: 150 }" placement="top">
							Открыть комментарии к данному посту.
						</b-popover>

					</div>
				</div>
				<div class="col-lg-6 col-12 px-0 order-lg-2 order-3">
					<div class="post_footer-collapse text-center">
						<button @click='ContentSection = !ContentSection'>
							{{ !ContentSection ? 'Развернуть пост' : 'Свернуть пост' }}
						</button>
					</div>
				</div>
				<div class="col-lg-3 col-12 px-0 order-lg-3 order-1 mt-lg-0 mt-2 mb-lg-0 mb-4">
					<div class="post_footer-author">
						<span class="text-center px-1 py-1">{{ AuthorInfo.UserName }}</span>
						<i :style="`background-image: url(${ AuthorInfo.UserImageID })`"></i>
					</div>
				</div>

			</section>

		</div>

		<!-- Контент -->
		<component :is="$isMobile ? `section` : `eccheuma-collapse`" :active="ContentSection">
			<transition name="Fade">
				<template v-if="ContentSection">
					<div class="post_content p-lg-5 p-3">
						<section key="PostKey-1" class="post_content-header text-lg-left text-center">
							<h4 style="font-size: 1.35rem">{{ payload.title }}</h4>
							<h6 style="font-size: .875rem">{{ payload.description }}</h6>
							<p>{{ AuthorInfo.UserName }} | {{ payload.time }}</p>
						</section>
						<section key="PostKey-2" class="post_content-body">

							<slot v-if="EditContent"></slot>

							<template v-else>
								<PostContent :source="Content"></PostContent>
							</template>

						</section>
						<section key="PostKey-3" class="post_content-footer mt-5">
							<h6 class="d-inline mr-2">Теги: </h6>
							<span>{{ payload.tags }}</span>
							<hr>
							<button class="mx-auto mt-5" type="button" @click='CommentSection = !CommentSection' v-b-toggle="`post_comment_collapse_ID${ payload.ID }`">
								Открыть комментарии
							</button>
						</section>
					</div>
				</template>
			</transition>
		</component>

		<!-- Комментарии-->
		<component :is="$isMobile ? `section` : `eccheuma-collapse`" :active="CommentSection">
			<div class="post_comments">

				<template v-if="!Comments">
					<section class="post_comments-first text-center py-5">
						<span>Тут ещё нет комментариев, но я крайне надеюсь что они появятся.</span>
					</section>
				</template>

				<transition-group name="Fade" mode="out-in">
					<post-comment 
						v-for="(item, index) in Comments" :key="`Comment#${ index }`" 
						:UserID='item.UserID'
						:ModerationMode='false' 
						:PostID='payload.ID' 
						:CommentID='item.ID'>
					</post-comment>
				</transition-group>

				<hr>

				<div class="post_comments-answer" style="color: #212121">

					<template v-if="LoginStatus">
						<h5>Оставьте свой комментарий</h5>
						<p>Не длинее 600 символов и не менее 6. <strong>Лимит: {{ CommentCharLimit }}</strong></p>
						<div class="row justify-content-center py-3">
							<div class="col-10">
								<textarea name="comment_section" v-model="Message" @input="EmitSound(`On`)"
									placeholder="Напишите тут что-то в ответ." maxlength="400">
								</textarea>
							</div>
						</div>
						<div class="post_comment-footer row justify-content-center">
							<div class="col-auto">
								<button :class="$v.Message.$invalid ? 'NonActive' : '' " @click="SendComment" type="button">
									Ответить <span>( Ctrl + Enter )</span>
								</button>
							</div>
						</div>
					</template>

					<template v-else>
						<h5>Для комментирования необходима авторизация</h5>
						<p class="pb-0">Это не так уж и сложно, да и получите сверху ещё больше функионала.</p>
					</template>

				</div>

			</div>
		</component>

	</section>
</template>

<style lang="sass">

$TextBlur: 0px
$TextBlurOpa: .5
$TextBorder: 1px

$DelayPostAnimation: .50s

.CounterTransition
	&-enter 
		&-active
			filter: opacity(0)
			transition: all .25s ease
		&-to
			filter: opacity(1)
	&-leave 
		&-active
			filter: opacity(1)
			transition: all .25s ease
		&-to
			filter: opacity(0)

.Fade
	&-enter
		// transform: translateY(10vh)
		@media screen and ( max-width: $MobileBreakPoint )
			transform: unset
		&-active
			opacity: 0
			transition: all .25s ease .25s
		&-to
			opacity: 1
			// transform: translateY(0px)
			@media screen and ( max-width: $MobileBreakPoint )
				transform: unset
	&-leave 
		// transform: translateY(0px)
		@media screen and ( max-width: $MobileBreakPoint )
			transform: unset
		&-active
			opacity: 1
			transition: all .25s ease .25s
		&-to
			opacity: 0
			// transform: translateY(10vh)
			@media screen and ( max-width: $MobileBreakPoint )
				transform: unset

.CommentAnimation
	&-enter 
		&-active
			opacity: 0
			transition: all $DelayPostAnimation ease
			transition-delay: $DelayPostAnimation
		&-to
			opacity: 1
	&-leave 
		&-active
			opacity: 1
			transition: all $DelayPostAnimation ease
		&-to
			opacity: 0

.post_btn_counter
		font-family: $default-font
		font-size: 13px

.post_comment_first
		padding: 40px 25% 20px
		text-align: center
		color: $color4
		font-size: 14px
		font-weight: 700

// -----------------

.post_wrap
	position: relative
	background-color: $color1

// --------------

.post_header
	position: relative
	z-index: 1000
	color: $color5
	font-size: $FontSize5
	letter-spacing: .5px
	background-size: cover
	background-position: center center
	background-repeat: no-repeat
	&:before
		position: absolute
		content-visibility: auto
		content: ""
		top: 0
		left: 0
		width: 100%
		height: 100%
		background-image: url(~assets/images/SVG/Stripes.svg)
		background-size: 12px
		opacity: .5
		z-index: 1
	&:after
		position: absolute
		content-visibility: auto
		content: ""
		top: 0
		left: 0
		width: 100%
		height: 100%
		background-color: $color1
		opacity: .5
		z-index: 2
	&-title
		position: relative
		z-index: 1000
		text-shadow: 0px 1px 3px rgba($color1,.75)
		h4
			font-weight: 600
		h6
			font-weight: 500
			font-size: $FontSize2	
	&-tags
		position: relative
		z-index: 1000
		font-weight: 700
		background-color: $color1
		border-radius: .7rem
	&-time
		position: relative
		z-index: 1000
		font-weight: 600
		background-color: $color1
		border-radius: .7rem

.post_footer
	position: relative
	z-index: 1000
	background-color: $color5
	&-author
		span
			position: absolute
			width: calc(100px + 3vw)
			top: -110px
			right: 1vw
			background-color: $color1
			border-radius: .7rem
			font-size: $FontSize4
			font-weight: 700
			@media screen and ( max-width: $MobileBreakPoint )
				position: relative
				top: -10px
				left: 33vw
				width: 33vw
				display: block	
		i
			position: absolute
			top: 0px
			right: 2.5vw
			background-size: cover
			background-position: center
			background-color: $color6
			border: 4px solid $color5
			border-radius: 100%			
			height: 100px
			width: 100px
			box-shadow: 0px 1vh 0px 0px $color6
			@media screen and ( max-width: $MobileBreakPoint )
				position: relative
				top: 0px
				left: calc(50vw - 50px)
				display: block

	&-social
		.clicked
			transition-duration: .25s
			background-color: $color2
			color: $color5
			// text-shadow: 0px 0px 3px $color5	
		.liked
			transition-duration: .25s
			background-color: $color2
			color: $color5
			// text-shadow: 0px 0px 3px $color5	
		button
			padding: 5px 25px
			margin: 0px 2px
			border-radius: .7rem
			color: $color3
			background-color: $color5
			font-size: $FontSize2
			line-height: 20px
			font-weight: 800
			transition-duration: .2s
			@extend %button_switch
	&-collapse
		button
			padding: 5px 10vw
			margin: 0px 2px
			border-radius: .7rem
			background-color: transparent
			color: $color2
			font-size: .7rem
			line-height: 20px
			font-weight: 700
			transition-duration: .2s
			animation: opacity .75s 1 
			@extend %button_switch	

.post_comments
	background-color: $color5
	&-first
		span
			color: $color3
			font-size: $FontSize2
			font-weight: 800
	&-answer
		padding: 30px 40px
		h5
			color: $color3
			font-size: $FontSize1
			text-align: center
			font-weight: 700
		p
			white-space: pre-wrap
			text-align: center
			font-weight: 500
			font-size: $FontSize2
		textarea
			resize: none
			display: block
			width: 100%
			height: 90px
			border-radius: .7rem
			padding: 15px 20px
			font-size: 12px
		button
			outline: none
			text-align: left
			margin: 10px 0
			padding: 2px 20px
			border-radius: .7rem
			background-color: $color5
			color: $color3
			font-size: 12px
			font-weight: 700
			transition-duration: .2s
			@extend %button_switch	
	&-footer
		padding: 10px 0
		button
			outline: none
			padding: 2px 20px
			border-radius: .7rem
			background-color: $color5
			color: $color3
			font-size: 12px
			font-weight: 700
			line-height: 20px
			transition-duration: .2s
			@extend %button_switch
			span
				padding-left: 5px
				font-size: 10px
				color: $color4	

.post_content
		background-color: $color5
		color: $color1
		min-height: 50vh
		&-header
			height: 100%
			p
				display: inline-block
				font-size: 12px
				font-weight: 700
				opacity: .75		
		&-footer
			button
				display: block	
				padding: 6px 10%
				border-radius: .7rem
				background-color: $color5
				color: $color3
				font-size: 12px
				font-weight: 800
				transition-duration: .2s
				@extend %button_switch
			span
				width: 100px
				text-align: center
				padding: 4px 20px
				border-radius: .7rem
				background-color: $color1
				color: $color5
				font-size: $FontSize5
				font-weight: 700	

</style>