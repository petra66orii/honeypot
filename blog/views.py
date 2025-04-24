from django.shortcuts import render, get_object_or_404, reverse, redirect
from django.views import generic
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator
from django.views.generic import DetailView, CreateView, UpdateView, DeleteView
from django.http import HttpResponseRedirect
from django.contrib import messages

from .forms import CreatePost, EditPost, CommentForm
from .models import BlogPost, Comment

# Create your views here.
# Views are borrowed and adapted from my Timeless Travel project


class AdminRequiredMixin:
    """
    Mixin that restricts access to superusers or staff users only.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            messages.error(
                request,
                "You do not have permission to access this page."
                )
            return render(request, "403.html")
        return super().dispatch(request, *args, **kwargs)


# Blog posts list view
class BlogPostList(generic.ListView):
    """
    Displays a paginated list of BlogPost objects.

    Attributes:
        model: The BlogPost model.
        template_name: The HTML template used to render the list.
        paginate_by: The number of posts to display per page.
    """
    model = BlogPost
    queryset = BlogPost.objects.filter(status=1).order_by('-created_at')
    template_name = "blog/blog_list.html"
    paginate_by = 5


class PostDetailView(DetailView):
    """
    Displays a detailed view of a BlogPost object.

    Allows users to leave comments,
    edit their own comments, and delete their own comments.

    Attributes:
        model: The BlogPost model.
        template_name: The HTML template used to render the post detail.
        context_object_name: The name of the variable used
        in the template to access the post object.
    """
    model = BlogPost
    template_name = 'blog/blog_post.html'
    context_object_name = 'blogpost'

    def get_context_data(self, **kwargs):
        """
        Adds the comment form and the comments
        for the current post to the context.

        Returns:
            A dictionary containing the context data for the template.
        """
        context = super().get_context_data(**kwargs)
        # Add the comment form and the comments for the current post
        context['form'] = CommentForm()
        context['comments'] = self.object.comments.filter(approved=True)
        return context

    def post(self, request, *args, **kwargs):
        """
        Handles comment submission.

        Validates the comment form, saves the comment if valid,
        displays success/error messages,
        and redirects back to the post detail page.

        Returns:
            An HttpResponseRedirect object on successful
            comment submission, or a rendered template
            with errors if the form is invalid.
        """
        self.object = self.get_object()
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = self.object
            comment.user = request.user
            comment.save()
            messages.success(
                request,
                "Comment submitted and awaiting approval."
                )
            return HttpResponseRedirect(reverse('post',
                                                args=[self.object.slug]))
        else:
            messages.error(request, "Ooops! Error adding comment!")

        # If the form is invalid, re-render the page with the form errors
        comments = self.object.comments.filter(approved=True)
        return render(
            request,
            self.template_name,
            {
                'blogpost': self.object,
                'comments': comments,
                'form': form,
            }
            )

    # Handle editing a comment
    def edit_comment(request, comment_id, slug):
        """
        Handles editing a comment.

        Fetches the comment object,
        validates the comment form with the new content,
        saves the comment if valid,
        displays success/error messages,
        and redirects back to the post detail page.

        Raises:
            Http404: If the comment is not found or the user is not the owner.
        """
        comment = get_object_or_404(Comment, id=comment_id, user=request.user)

        if request.method == 'POST':
            form = CommentForm(request.POST, instance=comment)
            if form.is_valid():
                form.save()
                messages.success(request, "Comment updated successfully!")
                return redirect('post', slug=comment.post.slug)
            else:
                messages.error(request, "Ooops! Error updating comment!")

    def delete_comment(request, comment_id, slug):
        """
        Handles deleting a comment.

        Fetches the comment object, checks if the user is the owner,
        deletes the comment if authorized,
        displays success/error messages,
        and redirects back to the post detail page.

        Raises:
            Http404: If the comment is not found.
        """
        comment = get_object_or_404(Comment, id=comment_id, user=request.user)

        if comment.user == request.user:
            comment.delete()
            messages.success(request, "Comment deleted successfully!")
            return HttpResponseRedirect(reverse('post',  args=[slug]))
        else:
            messages.error(request, "Failed to delete the comment.")
            return redirect('post', slug=slug)


# Create post view
class PostCreateView(AdminRequiredMixin, LoginRequiredMixin, CreateView):
    """
    A view for authenticated users to create new BlogPost objects.

    Requires users to be logged in using LoginRequiredMixin.

    Attributes:
        model: The BlogPost model.
        form_class: The CreatePost form class used for creating new posts.
        template_name: The HTML template used to render the create post form.
    """
    model = BlogPost
    form_class = CreatePost
    template_name = 'blog/create_post.html'

    def form_valid(self, form):
        """
        Overrides the default form_valid
        method to set the author of the post before saving.

        Assigns the currently logged-in user as the author
        of the post and then calls the parent class's
        form_valid method to save the form data.

        Args:
            form: The submitted CreatePost form.

        Returns:
            An HttpResponseRedirect object
            with the appropriate success message and redirect URL.
        """
        form.instance.author = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        """
        Determines the redirect URL after a post is successfully created.

        Checks the status of the created post
        and displays a different success message based on the status:

        - Published (status=1): Redirects to the detail view
        of the post with a "Post published successfully!" message.
        - Draft (status=0): Redirects to the detail view of the
        post with a "Post saved as draft!" message.

        Returns:
            The URL to redirect to after successful post creation.
        """
        if self.object.status == 1:
            messages.success(self.request, "Post published successfully!")
            return reverse('post', kwargs={'slug': self.object.slug})
        elif self.object.status == 0:
            messages.success(self.request, "Post saved as draft!")
            return reverse('post', kwargs={'slug': self.object.slug})


# Update post view
class PostUpdateView(AdminRequiredMixin, LoginRequiredMixin, UpdateView):
    """
    A view for authenticated users to update existing BlogPost objects.

    Requires users to be logged in using LoginRequiredMixin.

    Attributes:
        model: The BlogPost model.
        form_class: The EditPost form class used for updating posts.
        template_name: The HTML template used to render the update post form.
    """
    model = BlogPost
    form_class = EditPost
    template_name = 'blog/edit_post.html'

    def get_success_url(self):
        """
        Determines the redirect URL after a post is successfully updated.

        Displays a success message and redirects
        to the detail view of the updated post.

        Returns:
            The URL to redirect to after successful post update.
        """
        messages.success(self.request, "Post updated successfully!")
        return reverse('post', kwargs={'slug': self.object.slug})

    def get_queryset(self):
        """
        Filters the queryset to only include BlogPost
        objects authored by the currently logged-in user.

        This ensures that users can only update their own posts.

        Returns:
            A QuerySet containing only BlogPost objects
            authored by the current user.
        """
        # Only allow the logged-in user to update their checklists
        return BlogPost.objects.filter(author=self.request.user)


# Delete post view
class PostDeleteView(AdminRequiredMixin, LoginRequiredMixin, DeleteView):
    """
    A view for deleting BlogPost objects.

    Attributes:
        model: The BlogPost model.
        template_name: The HTML template used to confirm post deletion.
    """
    model = BlogPost
    template_name = 'blog/post_confirm_delete.html'

    def get_context_data(self, **kwargs):
        """
        Adds the blogpost object to the context data.

        Returns:
            A dictionary containing the context data for the template.
        """
        context = super().get_context_data(**kwargs)
        context['blogpost'] = self.object
        return context

    def get_success_url(self):
        """
        Determines the redirect URL after a post is successfully deleted.

        Redirects to the blog list view if the post was published (status=1)
        and to the user's draft list if the post was a draft (status=0).

        Returns:
            The URL to redirect to after successful post deletion.
        """
        messages.success(self.request, "Post deleted successfully!")
        return reverse('blog')


@login_required
def comment_management(request):

    if not request.user.is_staff:
        # Ensure only admins can access this page
        return render(request, "403.html")
    comments = Comment.objects.all().order_by('-created_at')
    paginator = Paginator(comments, 10)

    page_number = request.GET.get('page')
    page_comments = paginator.get_page(page_number)

    template = 'blog/comment_management.html'
    context = {
        'comments': page_comments,
    }

    return render(request, template, context)


@login_required
def approve_comment(request, comment_id):
    """
    Approve a review and allow it to be displayed on the product page.
    """
    if not request.user.is_staff:
        messages.error(
            request,
            "You do not have permission to approve comments."
            )
        return render(request, "403.html")

    comment = get_object_or_404(Comment, id=comment_id)
    comment.approved = True
    comment.save()
    messages.success(request, "Comment approved successfully!")

    return redirect('comment_management')


@login_required
def admin_delete_comment(request, comment_id):
    """
    Delete a review.
    """
    if not request.user.is_staff:
        messages.error(
            request,
            "You do not have permission to delete comments."
            )
        return render(request, "403.html")

    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    messages.success(request, "Comment deleted successfully!")

    return redirect('comment_management')
