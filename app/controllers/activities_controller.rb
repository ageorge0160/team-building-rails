class ActivitiesController < ApplicationController
  before_action :find_activity, only: [:show, :edit, :update, :destroy]
  before_action :require_login

  def short_to_long
    @activities = Activity.short_to_long
  end

  def new
    @activity = Activity.new
    @activity.topics.build
  end

  def create
    @activity = current_user.activities.build(activity_params)
    if @activity.save
      respond_to do |f|
        f.html {redirect_to activity_path(@activity)}
        f.json {render json: @activity}
      end

    else
      render 'new'
    end
  end

  def index
    @activities = Activity.all
    if @category = Category.find_by(id: params[:category_id])
      @activities = @category.activities.alpha
    else
      respond_to do |f|
        f.html {render :index}
        f.json {render json: @activities}
      end
    end
  end

  def show
    respond_to do |f|
      f.html {render :show}
      f.json {render json: @activity}
    end
  end

  def activity_data
    @activity = Activity.find(params[:id])
    render json: ActivitySerializer.serialize(@activity)
  end

  def edit
  end

  def update
    if @activity.update(activity_params)
      redirect_to activity_path(@activity)
    else
      render 'edit'
    end
  end

  def destroy
    @activity.destroy
    redirect_to activities_path
  end



private
  def find_activity
    @activity = Activity.find_by(id: params[:id])
  end

  def activity_params
    params.require(:activity).permit(:title, :description, :goal, :rules, :time, :category_id, topics_attributes: [:name])
  end
end
